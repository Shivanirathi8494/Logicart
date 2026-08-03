"use client";

import { useState } from "react";

export default function InscanShipmentCard({ shipment }: any) {

  const [loading, setLoading] = useState(false);

  async function inscan() {

    setLoading(true);

    const response = await fetch(
      "/api/dockets/" + shipment.trackingNumber + "/status",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "INSCAN",
          remarks: "Shipment received at warehouse",
        }),
      }
    );

    if (response.ok) {

      alert("Shipment Inscanned Successfully");

      location.reload();

    } else {

      alert("Unable to update shipment");

    }

    setLoading(false);

  }

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Shipment Details
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div>
          <div className="text-sm text-slate-500">Tracking Number</div>
          <div className="font-semibold">{shipment.trackingNumber}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Sender</div>
          <div>{shipment.senderName}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Receiver</div>
          <div>{shipment.receiverName}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Origin</div>
          <div>{shipment.origin}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Destination</div>
          <div>{shipment.destination}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Current Status</div>
          <div className="font-semibold text-blue-600">
            {shipment.status}
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <button
          disabled={loading || shipment.status === "INSCAN"}
          onClick={inscan}
          className="rounded-lg bg-green-600 px-6 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Updating..." : "Inscan Shipment"}
        </button>

      </div>

    </section>

  );

}
