"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  shipments: any[];
};

export default function ChallanSummary({ shipments }: Props) {
  const router = useRouter();

  const [vendorName, setVendorName] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  const deliveryType =
    shipments[0]?.deliveryType === "AIRPORT_DELIVERY"
      ? "AIRPORT_DELIVERY"
      : "DOOR_TO_DOOR";

  const isAirportDelivery =
    deliveryType === "AIRPORT_DELIVERY";

  const totalPieces = shipments.reduce(
    (sum: number, shipment: any) => sum + Number(shipment.packageCount || 0),
    0,
  );

  const totalWeight = shipments.reduce(
    (sum: number, shipment: any) =>
      sum + Number(shipment.chargeableWeight || 0),
    0,
  );

  async function generate() {
    if (!shipments.length) {
      alert("Please add at least one shipment.");
      return;
    }

    if (!vendorName.trim()) {
      alert(
        isAirportDelivery
          ? "Vendor / Warehouse Name is required."
          : "Receiver Name is required."
      );
      return;
    }

    if (!vendorAddress.trim()) {
      alert(
        isAirportDelivery
          ? "Vendor / Warehouse Address is required."
          : "Receiver Address is required."
      );
      return;
    }

    if (!vendorPhone.trim()) {
      alert(
        isAirportDelivery
          ? "Vendor Phone is required."
          : "Receiver Phone is required."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/delivery-challans", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          // Delivery Challan is generated at
          // the destination branch.
          origin: shipments[0].destination,

          // Backend validates and derives this again
          // from the selected shipment records.
          deliveryType,

          customerName: vendorName.trim(),
          customerAddress: vendorAddress.trim(),
          customerPhone: vendorPhone.trim(),

          // Vehicle belongs to the later
          // Out for Delivery operation.
          vehicleNumber: "",

          remarks: remarks.trim(),

          shipments: shipments.map((shipment: any) => shipment.id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to create Delivery Challan");
        return;
      }

      router.push("/portal/delivery/challan/" + data.challanNumber);
    } catch (error) {
      console.error(error);

      alert("Unable to create Delivery Challan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="text-lg font-semibold text-slate-900">
          {isAirportDelivery
            ? "Airport / Warehouse Delivery"
            : "Door to Door Delivery"}
        </div>

        <div className="mt-1 text-sm text-slate-500">
          {isAirportDelivery
            ? "Record shipment handover to the airport / warehouse."
            : "Prepare shipments for final door delivery."}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            {isAirportDelivery ? "Vendor / Warehouse Name *" : "Receiver Name *"}
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder={
              isAirportDelivery
                ? "Vendor / Warehouse Name"
                : "Receiver Name"
            }
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            {isAirportDelivery ? "Vendor Phone *" : "Receiver Phone *"}
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder={
              isAirportDelivery
                ? "Vendor Phone Number"
                : "Receiver Phone Number"
            }
            value={vendorPhone}
            onChange={(e) => setVendorPhone(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            {isAirportDelivery ? "Vendor / Warehouse Address *" : "Receiver Address *"}
          </label>

          <input
            className="w-full rounded-lg border p-3"
            placeholder={
              isAirportDelivery
                ? "Vendor / Airport / Warehouse Address"
                : "Receiver Address"
            }
            value={vendorAddress}
            onChange={(e) => setVendorAddress(e.target.value)}
          />
        </div>

        <textarea
          className="rounded-lg border p-3 md:col-span-2"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <div className="text-sm text-slate-500">Total Shipments</div>

          <div className="text-3xl font-bold">{shipments.length}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Total Pieces</div>

          <div className="text-3xl font-bold">{totalPieces}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Total Weight</div>

          <div className="text-3xl font-bold">{totalWeight.toFixed(2)} Kg</div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={generate}
          disabled={saving || !shipments.length}
          className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {saving ? "Generating..." : "Generate Delivery Challan"}
        </button>
      </div>
    </section>
  );
}
