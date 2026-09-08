"use client";

import { useEffect, useState } from "react";

export default function OutscanPage() {
  const [readyForOutscan, setReadyForOutscan] = useState<any[]>([]);

  const [readyForChallan, setReadyForChallan] = useState<any[]>([]);

  const [outForDelivery, setOutForDelivery] = useState<any[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [deliveryShipment, setDeliveryShipment] = useState<any>(null);
  const [deliveryReceiverName, setDeliveryReceiverName] = useState("");
  const [deliveryReceiverPhone, setDeliveryReceiverPhone] = useState("");
  const [deliveryReceiverAddress, setDeliveryReceiverAddress] = useState("");
  const [deliveryRemarks, setDeliveryRemarks] = useState("");
  const [savingDelivery, setSavingDelivery] = useState(false);

  /*
   * Shipment with a generated Delivery Challan is still
   * OUTSCAN until it is physically dispatched for delivery.
   */
  const [dispatchShipment, setDispatchShipment] = useState<any>(null);
  const [dispatchVehicleNumber, setDispatchVehicleNumber] = useState("");
  const [dispatchRemarks, setDispatchRemarks] = useState("");
  const [savingDispatch, setSavingDispatch] = useState(false);

  async function loadData() {
    try {
      setLoading(true);

      const [
        userResponse,
        receivedResponse,
        outscanResponse,
        deliveryResponse,
      ] = await Promise.all([
        fetch("/api/auth/me", {
          cache: "no-store",
        }),

        fetch("/api/dockets?status=RECEIVED", {
          cache: "no-store",
        }),

        fetch("/api/dockets?status=OUTSCAN", {
          cache: "no-store",
        }),

        fetch("/api/dockets?status=OUT_FOR_DELIVERY", {
          cache: "no-store",
        }),
      ]);

      if (userResponse.ok) {
        setCurrentUser(await userResponse.json());
      }

      if (receivedResponse.ok) {
        const rows = await receivedResponse.json();

        /*
         * Employee /api/dockets is already
         * branch scoped.
         *
         * RECEIVED + destination working
         * means ready for Outscan.
         */
        setReadyForOutscan(
          rows.filter(
            (shipment: any) =>
              shipment.nextAction === "OUTSCAN" ||
              shipment.workingSide === undefined,
          ),
        );
      }

      if (outscanResponse.ok) {
        const rows = await outscanResponse.json();

        /*
         * OUTSCAN shipments have two possible delivery states:
         *
         * 1. No challan yet
         *    -> Ready for Delivery Challan
         *
         * 2. Challan already generated
         *    -> Ready for Out for Delivery
         */
        setReadyForChallan(
          rows.filter(
            (shipment: any) =>
              !shipment.hasDeliveryChallan &&
              (shipment.nextAction === "DELIVERY_CHALLAN" ||
                shipment.workingSide === undefined),
          ),
        );

        /*
         * Only Door-to-Door shipments with a generated
         * challan proceed into the last-mile delivery queue.
         *
         * Airport / Warehouse shipments are completed
         * directly through their Delivery Challan.
         */
        const challanGenerated = rows.filter(
          (shipment: any) =>
            shipment.hasDeliveryChallan &&
            shipment.deliveryType === "DOOR_TO_DOOR",
        );

        setOutForDelivery((current) => [
          ...challanGenerated,
          ...current.filter(
            (shipment: any) => shipment.status === "OUT_FOR_DELIVERY",
          ),
        ]);
      }

      if (deliveryResponse.ok) {
        const rows = await deliveryResponse.json();

        setOutForDelivery((current) => {
          const waitingForDispatch = current.filter(
            (shipment: any) =>
              shipment.status === "OUTSCAN" &&
              shipment.hasDeliveryChallan &&
              shipment.deliveryType === "DOOR_TO_DOOR",
          );

          return [...waitingForDispatch, ...rows];
        });
      }
    } catch (error) {
      console.error("Unable to load Delivery Processing:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function outscan(shipment: any) {
    const confirmed = window.confirm(`Outscan ${shipment.trackingNumber}?`);

    if (!confirmed) {
      return;
    }

    const response = await fetch("/api/dockets/bulk-status", {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        trackingNumbers: [shipment.trackingNumber],

        status: "OUTSCAN",

        remarks: "Shipment outscanned for delivery",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data?.error || "Unable to Outscan shipment.");

      return;
    }

    await loadData();
  }

  function startDelivery(shipment: any) {
    setDispatchShipment(shipment);
    setDispatchVehicleNumber("");
    setDispatchRemarks("");
  }

  function closeDispatchDialog() {
    if (savingDispatch) {
      return;
    }

    setDispatchShipment(null);
    setDispatchVehicleNumber("");
    setDispatchRemarks("");
  }

  async function confirmStartDelivery() {
    if (!dispatchShipment) {
      return;
    }

    const vehicleNumber = dispatchVehicleNumber.trim().toUpperCase();

    if (!vehicleNumber) {
      alert("Vehicle Number is required.");
      return;
    }

    try {
      setSavingDispatch(true);

      const response = await fetch(
        `/api/dockets/${encodeURIComponent(
          dispatchShipment.trackingNumber,
        )}/out-for-delivery`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            vehicleNumber,
            remarks: dispatchRemarks.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Unable to start delivery.");

        return;
      }

      alert(`${dispatchShipment.trackingNumber} is now Out for Delivery.`);

      setDispatchShipment(null);
      setDispatchVehicleNumber("");
      setDispatchRemarks("");

      await loadData();
    } catch (error) {
      console.error("Unable to start delivery:", error);

      alert("Unable to start delivery.");
    } finally {
      setSavingDispatch(false);
    }
  }

  function markDelivered(shipment: any) {
    setDeliveryShipment(shipment);

    setDeliveryReceiverName(shipment.receiverName ?? "");

    setDeliveryReceiverPhone(shipment.receiverPhone ?? "");

    setDeliveryReceiverAddress(shipment.receiverAddress ?? "");

    setDeliveryRemarks("");
  }

  function closeDeliveryDialog() {
    if (savingDelivery) {
      return;
    }

    setDeliveryShipment(null);
    setDeliveryReceiverName("");
    setDeliveryReceiverPhone("");
    setDeliveryReceiverAddress("");
    setDeliveryRemarks("");
  }

  async function confirmDelivered() {
    if (!deliveryShipment) {
      return;
    }

    if (!deliveryReceiverName.trim()) {
      alert("Receiver Name is required.");
      return;
    }

    if (!deliveryReceiverPhone.trim()) {
      alert("Receiver Phone is required.");
      return;
    }

    if (!deliveryReceiverAddress.trim()) {
      alert("Receiver Address is required.");
      return;
    }

    try {
      setSavingDelivery(true);

      const response = await fetch("/api/delivery-attempts/delivered", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          trackingNumber: deliveryShipment.trackingNumber,

          receiverName: deliveryReceiverName.trim(),

          receiverPhone: deliveryReceiverPhone.trim(),

          receiverAddress: deliveryReceiverAddress.trim(),

          remarks: deliveryRemarks.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Unable to mark shipment as delivered.");

        return;
      }

      alert(`${deliveryShipment.trackingNumber} delivered successfully.`);

      setDeliveryShipment(null);
      setDeliveryReceiverName("");
      setDeliveryReceiverPhone("");
      setDeliveryReceiverAddress("");
      setDeliveryRemarks("");

      await loadData();
    } catch (error) {
      console.error("Unable to mark Delivered:", error);

      alert("Unable to mark shipment as delivered.");
    } finally {
      setSavingDelivery(false);
    }
  }

  async function markNotDelivered(shipment: any) {
    const remark = window.prompt(
      `Why was ${shipment.trackingNumber} not delivered?`,
    );

    if (remark === null) {
      return;
    }

    const cleanRemark = remark.trim();

    if (!cleanRemark) {
      alert("A remark is required for Not Delivered.");

      return;
    }

    /*
     * There is currently no NOT_DELIVERED
     * ShipmentStatus.
     *
     * Keep the AWB OUT_FOR_DELIVERY and
     * record the failed delivery attempt
     * in remarks.
     */
    try {
      const response = await fetch(
        `/api/dockets/${encodeURIComponent(shipment.trackingNumber)}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            remarks: "NOT DELIVERED: " + cleanRemark,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Unable to save Not Delivered remark.");

        return;
      }

      alert("Not Delivered remark saved.");

      await loadData();
    } catch (error) {
      console.error("Unable to save Not Delivered:", error);

      alert("Unable to save Not Delivered remark.");
    }
  }

  function viewChallan(shipment: any) {
    const challanNumber = shipment.deliveryChallanNumber;

    if (!challanNumber) {
      alert("Delivery Challan information is not available.");

      return;
    }

    window.location.href = `/portal/delivery/challan/${encodeURIComponent(
      challanNumber,
    )}`;
  }

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ff7417]">
            Destination Operations
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">
            Delivery Processing
          </h1>

          <p className="mt-2 text-slate-500">
            Process received shipments for final delivery.
          </p>
        </div>

        {currentUser?.branchCode && (
          <div className="w-full rounded-xl border bg-white px-4 py-3 shadow-sm sm:w-auto sm:px-5">
            <div className="text-xs text-slate-500">Delivery Branch</div>

            <div className="font-bold text-[#0b2340]">
              {currentUser.branchCode}
              {" — "}
              {currentUser.branchName}
            </div>
          </div>
        )}
      </div>

      {/* READY FOR OUTSCAN */}
      <ShipmentSection
        title="Ready for Outscan"
        subtitle="Received shipments ready to move for final delivery."
        rows={readyForOutscan}
        loading={loading}
        emptyMessage="No received shipments are waiting for Outscan."
        actionLabel="Outscan"
        onAction={outscan}
      />

      {/* READY FOR CHALLAN */}
      <ShipmentSection
        title="Ready for Delivery Challan"
        subtitle="Outscanned shipments ready for Delivery Challan."
        rows={readyForChallan}
        loading={loading}
        emptyMessage="No shipments are currently ready for Delivery Challan."
        actionLabel="Generate Challan"
        onAction={() => {
          window.location.href = "/portal/delivery/challan";
        }}
      />

      {/* OUT FOR DELIVERY */}
      <ShipmentSection
        title="Out for Delivery"
        subtitle="Confirm the final delivery result directly from this queue."
        rows={outForDelivery}
        loading={loading}
        emptyMessage="No shipments are currently out for delivery."
        actionLabel="View Challan"
        onAction={viewChallan}
        deliveryActions
        onStartDelivery={startDelivery}
        onDelivered={markDelivered}
        onNotDelivered={markNotDelivered}
      />
      {dispatchShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#ff7417]">
                  Delivery Dispatch
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0b2340]">
                  Start Out for Delivery
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AWB {dispatchShipment.trackingNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDispatchDialog}
                disabled={savingDispatch}
                className="text-3xl text-slate-400"
              >
                ×
              </button>
            </div>

            <div className="grid gap-5 p-6">
              <div>
                <label className="mb-2 block font-medium">
                  Vehicle Number *
                </label>

                <input
                  value={dispatchVehicleNumber}
                  onChange={(e) => setDispatchVehicleNumber(e.target.value)}
                  placeholder="Example: KA01AB1234"
                  className="w-full rounded-lg border p-3 uppercase"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Dispatch Remarks
                </label>

                <textarea
                  rows={3}
                  value={dispatchRemarks}
                  onChange={(e) => setDispatchRemarks(e.target.value)}
                  placeholder="Optional dispatch remarks..."
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-slate-50 p-6">
              <button
                type="button"
                onClick={closeDispatchDialog}
                disabled={savingDispatch}
                className="rounded-lg border bg-white px-6 py-3"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmStartDelivery}
                disabled={savingDispatch}
                className="rounded-lg bg-[#ff7417] px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {savingDispatch ? "Starting..." : "Start Delivery"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deliveryShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-green-600">
                  Final Delivery
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0b2340]">
                  Confirm Delivered
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AWB {deliveryShipment.trackingNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeliveryDialog}
                disabled={savingDelivery}
                className="text-3xl text-slate-400"
              >
                ×
              </button>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">
                  Receiver Name *
                </label>

                <input
                  value={deliveryReceiverName}
                  onChange={(e) => setDeliveryReceiverName(e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Receiver Phone *
                </label>

                <input
                  value={deliveryReceiverPhone}
                  onChange={(e) => setDeliveryReceiverPhone(e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">
                  Receiver Address *
                </label>

                <textarea
                  rows={3}
                  value={deliveryReceiverAddress}
                  onChange={(e) => setDeliveryReceiverAddress(e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">
                  Delivery Remarks
                </label>

                <textarea
                  rows={3}
                  value={deliveryRemarks}
                  onChange={(e) => setDeliveryRemarks(e.target.value)}
                  placeholder="Delivered to receiver / security / office staff..."
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-slate-50 p-6">
              <button
                type="button"
                onClick={closeDeliveryDialog}
                disabled={savingDelivery}
                className="rounded-lg border bg-white px-6 py-3"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelivered}
                disabled={savingDelivery}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {savingDelivery ? "Saving..." : "Confirm Delivered"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShipmentSection({
  title,
  subtitle,
  rows,
  loading,
  emptyMessage,
  actionLabel,
  onAction,
  deliveryActions = false,
  onStartDelivery,
  onDelivered,
  onNotDelivered,
}: {
  title: string;
  subtitle: string;
  rows: any[];
  loading: boolean;
  emptyMessage: string;
  actionLabel: string;
  onAction: (shipment: any) => void;
  deliveryActions?: boolean;
  onStartDelivery?: (shipment: any) => void;
  onDelivered?: (shipment: any) => void;
  onNotDelivered?: (shipment: any) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div>
          <h2 className="text-lg font-bold text-[#0b2340]">{title}</h2>

          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="text-sm font-medium text-slate-500">
          {rows.length} shipment
          {rows.length === 1 ? "" : "s"}
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center text-sm text-slate-500 sm:p-10">
          Loading shipments...
        </div>
      ) : !rows.length ? (
        <div className="p-6 text-center text-sm text-slate-500 sm:p-10">
          {emptyMessage}
        </div>
      ) : (
        <>
          {/* MOBILE SHIPMENT CARDS */}
          <div className="divide-y md:hidden">
            {rows.map((shipment: any) => (
              <div key={shipment.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="break-all font-bold text-[#0b2340]">
                      {shipment.trackingNumber}
                    </div>

                    <div className="mt-1 text-sm font-medium text-slate-600">
                      {shipment.origin}

                      <span className="mx-2 text-[#ff7417]">→</span>

                      {shipment.destination}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    {shipment.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-400">Receiver</div>

                    <div className="mt-1 truncate font-medium text-slate-700">
                      {shipment.receiverName || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">Pieces</div>

                    <div className="mt-1 font-semibold text-slate-700">
                      {shipment.packageCount ?? 0}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">
                      Chargeable Weight
                    </div>

                    <div className="mt-1 font-semibold text-slate-700">
                      {shipment.chargeableWeight ?? 0}
                      {" Kg"}
                    </div>
                  </div>
                </div>

                {deliveryActions ? (
                  <div className="mt-4 grid gap-2">
                    {shipment.status === "OUTSCAN" ? (
                      <button
                        type="button"
                        onClick={() => onStartDelivery?.(shipment)}
                        className="min-h-11 w-full rounded-lg bg-[#ff7417] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e9680d]"
                      >
                        Start Delivery
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onDelivered?.(shipment)}
                          className="min-h-11 rounded-lg bg-[#0b2340] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#163b63]"
                        >
                          Delivered
                        </button>

                        <button
                          type="button"
                          onClick={() => onNotDelivered?.(shipment)}
                          className="min-h-11 rounded-lg border border-[#ff7417] bg-white px-3 py-2.5 text-sm font-bold text-[#ff7417] transition hover:bg-orange-50"
                        >
                          Not Delivered
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onAction(shipment)}
                      className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b2340] transition hover:bg-slate-50"
                    >
                      View Challan
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAction(shipment)}
                    className="mt-4 min-h-11 w-full rounded-lg bg-[#ff7417] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e9680d]"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left">AWB</th>

                  <th className="px-5 py-4 text-left">Route</th>

                  <th className="px-5 py-4 text-left">Receiver</th>

                  <th className="px-5 py-4 text-left">Pieces</th>

                  <th className="px-5 py-4 text-left">Weight</th>

                  <th className="px-5 py-4 text-left">Status</th>

                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((shipment: any) => (
                  <tr key={shipment.id} className="border-t hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-[#0b2340]">
                      {shipment.trackingNumber}
                    </td>

                    <td className="px-5 py-4">
                      {shipment.origin}

                      <span className="mx-2 text-[#ff7417]">→</span>

                      {shipment.destination}
                    </td>

                    <td className="px-5 py-4">
                      {shipment.receiverName || "-"}
                    </td>

                    <td className="px-5 py-4">{shipment.packageCount ?? 0}</td>

                    <td className="px-5 py-4">
                      {shipment.chargeableWeight ?? 0}
                      {" Kg"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {shipment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      {deliveryActions ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {shipment.status === "OUTSCAN" ? (
                            <button
                              type="button"
                              onClick={() => onStartDelivery?.(shipment)}
                              className="rounded-lg bg-[#ff7417] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#e9680d]"
                            >
                              Start Delivery
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => onDelivered?.(shipment)}
                                className="rounded-lg bg-[#0b2340] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#163b63]"
                              >
                                Delivered
                              </button>

                              <button
                                type="button"
                                onClick={() => onNotDelivered?.(shipment)}
                                className="rounded-lg border border-[#ff7417] bg-white px-4 py-2.5 text-xs font-bold text-[#ff7417] transition hover:bg-orange-50"
                              >
                                Not Delivered
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => onAction(shipment)}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#0b2340] transition hover:bg-slate-50"
                          >
                            View Challan
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAction(shipment)}
                          className="rounded-lg bg-[#ff7417] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#e9680d]"
                        >
                          {actionLabel}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
