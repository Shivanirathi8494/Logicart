"use client";

import { useEffect, useState } from "react";

import { createShipment, getShipment, updateShipment } from "@/lib/api/docket";
import { initialShipment } from "@/lib/docket/initialShipment";

import CreateSuccessDialog from "./components/CreateSuccessDialog";
import ShipmentInformation from "./components/ShipmentInformation";
import SenderInformation from "./components/SenderInformation";
import ReceiverInformation from "./components/ReceiverInformation";
import ShipmentDetails from "./components/ShipmentDetails";
import PaymentInformation from "./components/PaymentInformation";
import ClientCommercialSummary, {
  ClientPricingPreview,
} from "./components/ClientCommercialSummary";

type Props = {
  trackingNumber?: string;
};

export default function CreateDocketPage({ trackingNumber }: Props) {
  const [shipment, setShipment] = useState(initialShipment);

  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdTrackingNumber, setCreatedTrackingNumber] = useState("");

  const [originLocked, setOriginLocked] = useState(false);

  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const [clientPricing, setClientPricing] =
    useState<ClientPricingPreview | null>(null);

  const [clientPricingLoading, setClientPricingLoading] = useState(false);

  const [clientPricingError, setClientPricingError] = useState("");

  const isEdit = !!trackingNumber;

  const isClient = currentRole === "CLIENT";

  useEffect(() => {
    console.log("[CreateDocket] shipment changed:", {
      origin: shipment.origin,
      destination: shipment.destination,
      bookingDate: shipment.bookingDate,
      airlineId: shipment.airlineId,
    });
  }, [
    shipment.origin,
    shipment.destination,
    shipment.bookingDate,
    shipment.airlineId,
  ]);

  /*
   * For a new booking, an EMPLOYEE always books
   * from their assigned branch.
   *
   * Do not apply this during edit mode because an
   * existing shipment must retain its actual origin.
   */
  useEffect(() => {
    if (isEdit) return;

    async function loadCurrentUserBranch() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const user = await response.json();

        setCurrentRole(user?.role ?? null);

        if (user?.role === "EMPLOYEE" && user?.branchCode) {
          const branchCode = String(user.branchCode).trim().toUpperCase();

          console.log("[CreateDocket] authenticated branch:", branchCode);

          setShipment((previous) => {
            console.log(
              "[CreateDocket] origin before branch assignment:",
              previous.origin,
            );

            return {
              ...previous,
              origin: branchCode,

              // Clear flight-specific values because
              // origin determines available connectivity.
              flightNumber: "",
              scheduledDeparture: "",
              scheduledArrival: "",
            };
          });

          setOriginLocked(true);
        }
      } catch (error) {
        console.error("Unable to load employee branch:", error);
      }
    }

    loadCurrentUserBranch();
  }, [isEdit]);

  useEffect(() => {
    if (
      isEdit ||
      !isClient ||
      !shipment.origin ||
      !shipment.destination ||
      shipment.packages.length === 0
    ) {
      setClientPricing(null);
      setClientPricingError("");
      return;
    }

    const hasValidWeight = shipment.packages.some(
      (pkg) =>
        Number(pkg.weight) > 0 &&
        Number(pkg.length) > 0 &&
        Number(pkg.width) > 0 &&
        Number(pkg.height) > 0,
    );

    if (!hasValidWeight) {
      setClientPricing(null);
      setClientPricingError("");
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setClientPricingLoading(true);
        setClientPricingError("");

        const response = await fetch("/api/client/pricing/preview", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            origin: shipment.origin,

            destination: shipment.destination,

            serviceType: shipment.serviceType,
            airlineId: shipment.airlineId,

            packages: shipment.packages,
          }),

          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to calculate client pricing.");
        }

        /*
         * No negotiated route exists yet and the
         * client has not selected an airline.
         *
         * This is not an error. It simply means
         * pricing is waiting for the airline so the
         * standard backend tariff can be resolved.
         */
        if (data.pricingPending) {
          setClientPricing(null);

          setClientPricingError(
            data.message || "Select an airline to calculate the standard rate.",
          );

          setShipment((previous) => ({
            ...previous,

            actualWeight: data.weights?.actualWeight ?? previous.actualWeight,

            volumetricWeight:
              data.weights?.volumetricWeight ?? previous.volumetricWeight,

            chargeableWeight:
              data.weights?.chargeableWeight ?? previous.chargeableWeight,

            freight: 0,
            gst: 0,
            total: 0,

            tariffError: "",
          }));

          return;
        }

        setClientPricing(data);

        /*
         * Keep shipment state compatible with
         * existing AWB/payment rendering.
         *
         * These values remain display-only for
         * CLIENT because final booking pricing
         * is recalculated on the server.
         */
        setShipment((previous) => ({
          ...previous,

          /*
           * serviceType belongs to the negotiated
           * client-rate workflow.
           *
           * STANDARD_RATE is a pricing source, not a
           * contracted service selection. Keep the form
           * serviceType empty for standard airline pricing.
           */
          serviceType:
            data.pricing.pricingSource === "CLIENT_RATE_CARD"
              ? data.pricing.serviceType
              : "",

          actualWeight: data.weights.actualWeight,

          volumetricWeight: data.weights.volumetricWeight,

          chargeableWeight: data.weights.chargeableWeight,

          freight: data.pricing.freightAmount,

          gst: data.pricing.gstAmount,

          total: data.pricing.totalAmount,

          tariffError: "",
        }));
      } catch (error: any) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Unable to preview client pricing:", error);

        setClientPricing(null);

        setClientPricingError(
          error?.message || "Unable to calculate client pricing.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setClientPricingLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    isEdit,
    isClient,
    shipment.origin,
    shipment.destination,
    shipment.serviceType,
    shipment.airlineId,
    shipment.packages,
  ]);

  useEffect(() => {
    if (!trackingNumber) return;
    loadShipment();
  }, [trackingNumber]);

  async function loadShipment() {
    const data = await getShipment(trackingNumber!);

    setShipment({
      trackingNumber: data.trackingNumber,

      bookingDate: new Date(data.bookingDate).toISOString().split("T")[0],

      customerId: data.customerId ?? "",
      origin: data.origin,
      destination: data.destination,
      serviceType: data.serviceType ?? "",

      airlineId: data.airlineId ?? "",
      flightNumber: data.flightNumber ?? "",

      scheduledDeparture: data.scheduledDeparture ?? "",
      scheduledArrival: data.scheduledArrival ?? "",
      aircraftType: data.aircraftType ?? "",
      departureTerminal: data.departureTerminal ?? "",
      arrivalTerminal: data.arrivalTerminal ?? "",

      senderName: data.senderName ?? "",
      senderPhone: data.senderPhone ?? "",
      senderGSTIN: data.senderGSTIN ?? "",
      senderPincode: data.senderPincode ?? "",
      invoiceNumber: data.invoiceNumber ?? "",
      invoiceValue:
        data.invoiceValue !== null && data.invoiceValue !== undefined
          ? String(data.invoiceValue)
          : "",
      senderState: data.senderState ?? "",
      senderCity: data.senderCity ?? "",
      senderAddress: data.senderAddress ?? "",

      receiverName: data.receiverName ?? "",
      receiverPhone: data.receiverPhone ?? "",
      receiverGSTIN: data.receiverGSTIN ?? "",
      receiverPincode: data.receiverPincode ?? "",
      receiverState: data.receiverState ?? "",
      receiverCity: data.receiverCity ?? "",
      receiverAddress: data.receiverAddress ?? "",

      packageCount: data.packageCount,

      actualWeight: data.actualWeight,
      volumetricWeight: data.volumetricWeight,
      chargeableWeight: data.chargeableWeight,

      contents: data.contents ?? "",

      freight: data.freight,
      gst: data.gst,
      total: data.total,

      paymentReference: data.paymentReference ?? "",
      remarks: data.remarks ?? "",

      packages: data.packages.map((pkg: any) => ({
        length: pkg.length,
        width: pkg.width,
        height: pkg.height,
        weight: Number(pkg.weight || 0),
      })),
    });
  }

  async function handleCreateDocket() {
    try {
      setLoading(true);

      if (!shipment.customerId) {
        alert("Please select Customer ID.");
        return;
      }

      if (!shipment.origin) {
        alert("Please select Origin.");
        return;
      }

      if (!shipment.destination) {
        alert("Please select Destination.");
        return;
      }

      if (shipment.origin === shipment.destination) {
        alert("Origin and Destination cannot be the same.");
        return;
      }

      if (!shipment.airlineId) {
        alert("Please select Airline.");
        return;
      }

      if (!shipment.flightNumber?.trim()) {
        alert("Please enter Flight Number.");
        return;
      }

      if (!shipment.senderName.trim()) {
        alert("Please enter Sender Name.");
        return;
      }

      if (!shipment.senderPhone.trim()) {
        alert("Please enter Sender Mobile Number.");
        return;
      }

      if (!shipment.senderPincode?.trim()) {
        alert("Please enter Sender Pincode.");
        return;
      }

      if (!(shipment.senderAddress ?? "").trim()) {
        alert("Please enter Sender Address.");
        return;
      }

      if (!shipment.receiverName.trim()) {
        alert("Please enter Receiver Name.");
        return;
      }

      if (!shipment.receiverPhone.trim()) {
        alert("Please enter Receiver Mobile Number.");
        return;
      }

      if (!shipment.receiverPincode?.trim()) {
        alert("Please enter Receiver Pincode.");
        return;
      }

      if (!(shipment.receiverAddress ?? "").trim()) {
        alert("Please enter Receiver Address.");
        return;
      }

      for (const [index, pkg] of shipment.packages.entries()) {
        if (pkg.length <= 0 || pkg.width <= 0 || pkg.height <= 0) {
          alert(`Please enter valid dimensions for Package ${index + 1}.`);
          return;
        }

        if (!pkg.weight || pkg.weight <= 0) {
          alert(`Please enter valid weight for Package ${index + 1}.`);
          return;
        }
      }

      if (!isEdit && isClient) {
        if (!clientPricing) {
          alert(
            clientPricingError ||
              "Client pricing is not available for this booking.",
          );
          return;
        }

        if (
          clientPricing.client.billingType === "PREPAID_WALLET" &&
          !clientPricing.wallet.sufficientBalance
        ) {
          alert(
            "Insufficient prepaid wallet balance. Please top up your wallet before creating this docket.",
          );
          return;
        }
      }

      const response = isEdit
        ? await updateShipment(trackingNumber!, shipment)
        : await createShipment(shipment);

      setCreatedTrackingNumber(response.trackingNumber);

      setSuccessOpen(true);

      setShipment({
        ...initialShipment,
        bookingDate: new Date().toISOString().split("T")[0],
        packages: [{ length: 0, width: 0, height: 0, weight: 0 }],
      });
    } catch (error) {
      console.error(error);

      alert("Unable to create shipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Docket</h1>

        <p className="mt-2 text-slate-500">
          Enter shipment information to create a new shipment.
        </p>
      </div>

      <ShipmentInformation
        shipment={shipment}
        setShipment={setShipment}
        originLocked={originLocked}
        clientPricing={isClient && !isEdit}
      />

      <SenderInformation shipment={shipment} setShipment={setShipment} />

      <ReceiverInformation shipment={shipment} setShipment={setShipment} />

      <ShipmentDetails
        shipment={shipment}
        setShipment={setShipment}
        clientPricing={isClient && !isEdit}
      />

      {isClient && !isEdit ? (
        <ClientCommercialSummary
          preview={clientPricing}
          loading={clientPricingLoading}
          error={clientPricingError}
        />
      ) : (
        <PaymentInformation shipment={shipment} setShipment={setShipment} />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end gap-4 border-t pt-6">
        <button className="rounded-lg border px-6 py-3">Save Draft</button>

        <button
          onClick={handleCreateDocket}
          disabled={loading}
          className="rounded-lg bg-[#1877F2] px-6 py-3 text-white disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Docket"
              : "Create Docket"}
        </button>
      </div>

      <CreateSuccessDialog
        open={successOpen}

        trackingNumber={createdTrackingNumber}

        onPreview={() => {
          window.open(
            "/portal/docket/preview?tracking=" + createdTrackingNumber,
            "_blank",
          );
        }}

        onPrint={() => {
          window.open(
            "/portal/docket/preview?tracking=" + createdTrackingNumber,
            "_blank",
          );
        }}

        onNew={() => {
          setSuccessOpen(false);
        }}

        onClose={() => {
          setSuccessOpen(false);
        }}
      />
    </div>
  );
}
