"use client";

import { useEffect, useState } from "react";

import {
  createShipment,
  getShipment,
  updateShipment,
} from "@/lib/api/docket";
import { initialShipment } from "@/lib/docket/initialShipment";

import CreateSuccessDialog from "./components/CreateSuccessDialog";
import ShipmentInformation from "./components/ShipmentInformation";
import SenderInformation from "./components/SenderInformation";
import ReceiverInformation from "./components/ReceiverInformation";
import ShipmentDetails from "./components/ShipmentDetails";
import PaymentInformation from "./components/PaymentInformation";

type Props = {
  trackingNumber?: string;
};

export default function CreateDocketPage({
  trackingNumber,
}: Props) {

  const [shipment, setShipment] = useState(initialShipment);

  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdTrackingNumber, setCreatedTrackingNumber] = useState("");

  const isEdit = !!trackingNumber;

  useEffect(() => {
    if (!trackingNumber) return;
    loadShipment();
  }, [trackingNumber]);

  async function loadShipment() {

  const data = await getShipment(trackingNumber!);

  setShipment({

    trackingNumber: data.trackingNumber,

    bookingDate: new Date(data.bookingDate)
      .toISOString()
      .split("T")[0],

    customerId: data.customerId ?? "",
    origin: data.origin,
    destination: data.destination,

    airlineId: data.airlineId ?? "",
    flightNumber: data.flightNumber ?? "",

    scheduledDeparture:
      data.scheduledDeparture ?? "",
    scheduledArrival:
      data.scheduledArrival ?? "",
    aircraftType:
      data.aircraftType ?? "",
    departureTerminal:
      data.departureTerminal ?? "",
    arrivalTerminal:
      data.arrivalTerminal ?? "",

    senderName: data.senderName ?? "",
    senderPhone: data.senderPhone ?? "",
    senderGSTIN: data.senderGSTIN ?? "",
    senderPincode: data.senderPincode ?? "",
    invoiceNumber: data.invoiceNumber ?? "",
    invoiceValue:
      data.invoiceValue !== null &&
      data.invoiceValue !== undefined
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
      }

      const response = isEdit
        ? await updateShipment(trackingNumber!, shipment)
        : await createShipment(shipment);


      setCreatedTrackingNumber(response.trackingNumber);

      setSuccessOpen(true);

      setShipment({
        ...initialShipment,
        bookingDate:new Date().toISOString().split("T")[0],
        packages:[{length:0,width:0,height:0}],
      });

    } catch (error) {

      console.error(error);

      alert("Unable to create shipment");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Create Docket

        </h1>

        <p className="mt-2 text-slate-500">

          Enter shipment information to create a new shipment.

        </p>

      </div>

      <ShipmentInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <SenderInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <ReceiverInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <ShipmentDetails
        shipment={shipment}
        setShipment={setShipment}
      />

      <PaymentInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <div className="flex justify-end gap-4 border-t pt-6">

        <button
          className="rounded-lg border px-6 py-3"
        >
          Save Draft
        </button>

        <button
          onClick={handleCreateDocket}
          disabled={loading}
          className="rounded-lg bg-[#1877F2] px-6 py-3 text-white disabled:opacity-50"
        >

          {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Docket" : "Create Docket")}

        </button>

      </div>

      <CreateSuccessDialog

        open={successOpen}

        trackingNumber={createdTrackingNumber}

        onPreview={() => {

          window.open("/portal/docket/preview?tracking="+createdTrackingNumber,"_blank");

        }}

        onPrint={() => {

          window.open("/portal/docket/preview?tracking="+createdTrackingNumber,"_blank");

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
