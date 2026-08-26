"use client";

import { useEffect, useState } from "react";

export default function ShipmentSearch({ onAdd }: any) {
  const [tracking, setTracking] = useState("");
  const [available, setAvailable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAvailable() {
    try {
      setLoading(true);

      const response = await fetch("/api/dockets?status=OUTSCAN", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const rows = await response.json();

      /*
       * For an EMPLOYEE, /api/dockets already
       * returns workingSide + nextAction.
       *
       * Only destination-side OUTSCAN shipments
       * are ready for Delivery Challan.
       *
       * Admin does not receive workingSide, so
       * OUTSCAN shipments remain visible to Admin.
       */
      const eligible = rows.filter(
        (shipment: any) =>
          shipment.status === "OUTSCAN" &&
          !shipment.hasDeliveryChallan &&
          (shipment.nextAction === "DELIVERY_CHALLAN" ||
            shipment.workingSide === undefined),
      );

      setAvailable(eligible);
    } catch (error) {
      console.error(
        "Unable to load shipments ready for Delivery Challan:",
        error,
      );

      setAvailable([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailable();
  }, []);

  function addShipment(shipment: any) {
    onAdd(shipment);

    /*
     * Once an AWB is selected for the challan,
     * remove it from the Ready list immediately.
     */
    setAvailable((current) =>
      current.filter((item: any) => item.id !== shipment.id),
    );
  }

  async function search() {
    const value = tracking.trim();

    if (!value) {
      return;
    }

    try {
      const response = await fetch(
        "/api/dockets?tracking=" + encodeURIComponent(value),
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const rows = await response.json();

      const shipment = rows.find(
        (item: any) =>
          item.status === "OUTSCAN" &&
          (item.nextAction === "DELIVERY_CHALLAN" ||
            item.workingSide === undefined),
      );

      if (!shipment) {
        alert("Shipment is not available for Delivery Challan at your branch.");
        return;
      }

      addShipment(shipment);
      setTracking("");
    } catch (error) {
      console.error(error);

      alert("Unable to find shipment.");
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm sm:space-y-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-[#0b2340]">
          Ready for Delivery Challan
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          OUTSCAN shipments ready for delivery processing at your branch.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-slate-50 p-6 text-center text-sm text-slate-500">
          Loading available shipments...
        </div>
      ) : available.length === 0 ? (
        <div className="rounded-xl border bg-slate-50 p-6 text-center text-sm text-slate-500">
          No OUTSCAN shipments are currently ready for Delivery Challan.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          {/* MOBILE READY SHIPMENTS */}
          <div className="divide-y md:hidden">
            {available.map((shipment: any) => (
              <div key={shipment.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      AWB
                    </div>

                    <div className="mt-1 break-all font-bold text-[#0b2340]">
                      {shipment.trackingNumber}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-[#ff7417]">
                    OUTSCAN
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-400">Route</div>

                    <div className="mt-1 font-semibold text-slate-700">
                      {shipment.origin}

                      <span className="mx-2 text-[#ff7417]">→</span>

                      {shipment.destination}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">Weight</div>

                    <div className="mt-1 font-semibold text-slate-700">
                      {Number(shipment.chargeableWeight ?? 0).toFixed(2)} Kg
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-xs text-slate-400">Receiver</div>

                    <div className="mt-1 break-words font-medium text-slate-700">
                      {shipment.receiverName || "—"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addShipment(shipment)}
                  className="mt-4 min-h-11 w-full rounded-lg bg-[#ff7417] px-4 py-2.5 font-bold text-white hover:bg-[#e9680d]"
                >
                  Add Shipment
                </button>
              </div>
            ))}
          </div>

          {/* DESKTOP READY SHIPMENT TABLE */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">AWB</th>

                  <th className="px-4 py-3 text-left">Route</th>

                  <th className="px-4 py-3 text-left">Receiver</th>

                  <th className="px-4 py-3 text-left">Weight</th>

                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {available.map((shipment: any) => (
                  <tr key={shipment.id} className="border-t">
                    <td className="px-4 py-3 font-semibold text-[#0b2340]">
                      {shipment.trackingNumber}
                    </td>

                    <td className="px-4 py-3">
                      {shipment.origin}
                      <span className="mx-2 text-[#ff7417]">→</span>
                      {shipment.destination}
                    </td>

                    <td className="px-4 py-3">
                      {shipment.receiverName || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {shipment.chargeableWeight ?? 0}
                      {" Kg"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onAdd(shipment)}
                        className="rounded-lg bg-[#ff7417] px-4 py-2 text-xs font-bold text-white hover:bg-[#e9680d]"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="border-t pt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Or enter AWB manually
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <input
            className="min-h-11 w-full flex-1 rounded-lg border p-3 text-base"
            placeholder="AWB Number"
            value={tracking}
            onChange={(event) => setTracking(event.target.value)}
          />

          <button
            type="button"
            onClick={search}
            className="min-h-11 w-full rounded-lg bg-[#0b2340] px-6 py-3 font-semibold text-white sm:w-auto"
          >
            Add Shipment
          </button>
        </div>
      </div>
    </section>
  );
}
