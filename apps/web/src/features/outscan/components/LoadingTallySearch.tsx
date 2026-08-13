"use client";

import { useEffect, useState } from "react";

export default function LoadingTallySearch({
  shipments,
  setShipments,
}: any) {
  const [awb, setAwb] = useState("");
  const [available, setAvailable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAvailable() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/dockets?status=BOOKED"
      );

      if (!response.ok) {
        throw new Error("Unable to load BOOKED AWBs");
      }

      const data = await response.json();

      const selectedIds = new Set(
        shipments.map((shipment: any) => shipment.id)
      );

      setAvailable(
        data.filter(
          (shipment: any) => !selectedIds.has(shipment.id)
        )
      );
    } catch (error) {
      console.error("Unable to load available AWBs:", error);
      setAvailable([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailable();
  }, [shipments]);

  async function addShipment() {
    const value = awb.trim();

    if (!value) {
      alert("Please enter AWB Number.");
      return;
    }

    try {
      const response = await fetch(
        "/api/dockets?tracking=" +
          encodeURIComponent(value)
      );

      const data = await response.json();

      if (!data.length) {
        alert("AWB not found.");
        return;
      }

      const shipment = data[0];

      if (shipment.status !== "BOOKED") {
        alert(
          "This AWB is not available for loading. Only BOOKED AWBs can be added."
        );
        return;
      }

      if (
        shipments.find(
          (s: any) => s.id === shipment.id
        )
      ) {
        alert("AWB already added.");
        return;
      }

      setShipments([
        ...shipments,
        shipment,
      ]);

      setAwb("");
    } catch (error) {
      console.error("Unable to add AWB:", error);
      alert("Unable to add AWB.");
    }
  }

  function addAvailableShipment(shipment: any) {
    if (shipment.status !== "BOOKED") {
      return;
    }

    if (
      shipments.find(
        (s: any) => s.id === shipment.id
      )
    ) {
      return;
    }

    setShipments([
      ...shipments,
      shipment,
    ]);
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex gap-3">
        <input
          className="flex-1 rounded-lg border p-3"
          placeholder="Enter AWB Number"
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addShipment();
            }
          }}
        />

        <button
          onClick={addShipment}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
        >
          Add AWB
        </button>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Available BOOKED AWBs
          </h2>

          <span className="text-sm text-slate-500">
            {available.length} available
          </span>
        </div>

        {loading ? (
          <div className="rounded-lg border p-5 text-center text-slate-500">
            Loading available AWBs...
          </div>
        ) : available.length === 0 ? (
          <div className="rounded-lg border p-5 text-center text-slate-500">
            No BOOKED AWBs available.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto rounded-lg border">
            {available.map((shipment: any) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between border-b p-4 last:border-b-0 hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold">
                    {shipment.trackingNumber}
                  </div>

                  <div className="text-sm text-slate-500">
                    {shipment.origin} → {shipment.destination}
                  </div>

                  <div className="text-xs text-slate-400">
                    {shipment.senderName} → {shipment.receiverName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addAvailableShipment(shipment)
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
