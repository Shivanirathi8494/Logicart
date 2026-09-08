"use client";

import {
  ArrowRight,
  Eye,
  Printer,
  Pencil,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";

type Props = {
  loading: boolean;
  rows: any[];
  onSelect: (
    shipment: any
  ) => void;
  hasSearched: boolean;
  isEmployee?: boolean;
};

function nextActionLabel(
  action?: string
) {
  switch (action) {
    case "INSCAN":
      return "Inscan";

    case "UPDATE_DOCKET":
      return "Update Docket";

    case "LOAD_MANIFEST":
      return "Load / Manifest";

    case "UNLOAD":
      return "Unload";

    case "OUTSCAN":
      return "Outscan";

    case "DELIVERY_CHALLAN":
      return "Delivery Challan";

    case "DELIVER":
      return "Deliver";

    default:
      return "Completed";
  }
}

function openNextAction(
  row: any
) {
  switch (row.nextAction) {
    case "INSCAN":
      window.location.href =
        `/portal/operations/inscan?tracking=${encodeURIComponent(
          row.trackingNumber
        )}`;
      return;

    case "UPDATE_DOCKET":
      window.location.href =
        `/portal/operations/create-docket?tracking=${encodeURIComponent(
          row.trackingNumber
        )}`;
      return;

    case "LOAD_MANIFEST":
      window.location.href =
        "/portal/warehouse/manifest";
      return;

    /*
     * MANIFESTED shipments are unloaded through
     * the destination Incoming / Unload workflow.
     */
    case "UNLOAD":
      window.location.href =
        "/portal/warehouse/inscan";
      return;

    case "OUTSCAN":
      window.location.href =
        "/portal/warehouse/outscan";
      return;

    case "DELIVERY_CHALLAN":
      window.location.href =
        "/portal/delivery/challan";
      return;

    default:
      return;
  }
}

export default function SearchResults({
  loading,
  rows,
  onSelect,
  hasSearched,
  isEmployee = false,
}: Props) {

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        Loading shipments...
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">

        <div className="text-lg font-semibold text-[#0b2340]">
          No shipments require attention.
        </div>

        <p className="mt-2 text-sm text-slate-500">
          You're all caught up for this view.
        </p>

      </div>
    );
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border bg-white shadow-sm">

      {/* MOBILE SHIPMENT CARDS */}
      <div className="divide-y md:hidden">

        {rows.map((row) => {
          const hasNextAction =
            row.nextAction &&
            row.nextAction !== "NONE";

          const isOrigin =
            row.workingSide === "ORIGIN" ||
            row.workingSide === "BOTH";

          const isDestination =
            row.workingSide === "DESTINATION";

          return (
            <div
              key={row.id}
              className="p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <div className="break-all text-base font-bold text-[#0b2340]">
                    {row.trackingNumber}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {row.senderName || "-"}
                    {" → "}
                    {row.receiverName || "-"}
                  </div>

                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  {row.status}
                </span>

              </div>


              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">

                <div>
                  <div className="text-xs text-slate-400">
                    Route
                  </div>

                  <div className="mt-1 font-semibold text-slate-700">
                    {row.origin}
                    <span className="mx-1.5 text-[#ff7417]">
                      →
                    </span>
                    {row.destination}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Weight
                  </div>

                  <div className="mt-1 font-semibold text-slate-700">
                    {row.chargeableWeight ?? 0} Kg
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Booking Date
                  </div>

                  <div className="mt-1 font-medium text-slate-700">
                    {row.bookingDate
                      ? new Date(
                          row.bookingDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Your Work
                  </div>

                  <div className="mt-1">

                    {isEmployee ? (
                      isOrigin ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
                          <PlaneTakeoff
                            size={13}
                          />
                          Origin
                        </span>
                      ) : isDestination ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                          <PlaneLanding
                            size={13}
                          />
                          Destination
                        </span>
                      ) : (
                        "-"
                      )
                    ) : (
                      <span className="text-xs text-slate-500">
                        Full Access
                      </span>
                    )}

                  </div>
                </div>

              </div>


              <div className="mt-4 flex flex-col gap-2 border-t pt-4">

                {isEmployee &&
                  hasNextAction && (
                    <button
                      type="button"
                      onClick={() =>
                        openNextAction(row)
                      }
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ff7417] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e9680d]"
                    >
                      {nextActionLabel(
                        row.nextAction
                      )}

                      <ArrowRight
                        size={16}
                      />
                    </button>
                  )}


                <div className="grid grid-cols-2 gap-2">

                  {hasSearched && (
                    <button
                      type="button"
                      onClick={() =>
                        onSelect(row)
                      }
                      className="flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      <Eye size={15} />
                      Manage
                    </button>
                  )}


                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/portal/docket/preview?tracking=${encodeURIComponent(
                          row.trackingNumber
                        )}`,
                        "_blank"
                      )
                    }
                    className="flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <Eye size={15} />
                    Preview
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/api/airwaybill-pixel/${encodeURIComponent(
                          row.trackingNumber
                        )}`,
                        "_blank"
                      )
                    }
                    className="flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    <Printer size={15} />
                    Print
                  </button>


                  {!isEmployee && (
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href =
                          `/portal/operations/create-docket?tracking=${encodeURIComponent(
                            row.trackingNumber
                          )}`)
                      }
                      className="flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* DESKTOP TABLE */}
      <div className="hidden overflow-x-auto md:block">

        <table className="min-w-[1100px] w-full text-sm">

          <thead className="bg-slate-50">
            <tr>

              <th className="px-4 py-4 text-left">
                AWB Number
              </th>

              <th className="px-4 py-4 text-left">
                Route
              </th>

              <th className="px-4 py-4 text-left">
                Booking Date
              </th>

              <th className="px-4 py-4 text-left">
                Your Work
              </th>

              <th className="px-4 py-4 text-left">
                Status
              </th>

              <th className="px-4 py-4 text-left">
                Weight
              </th>

              <th className="px-4 py-4 text-left">
                Next Action
              </th>

              <th className="px-4 py-4 text-right">
                More
              </th>

            </tr>
          </thead>

          <tbody>

            {rows.map((row) => {
              const hasNextAction =
                row.nextAction &&
                row.nextAction !==
                  "NONE";

              const isOrigin =
                row.workingSide ===
                  "ORIGIN" ||
                row.workingSide ===
                  "BOTH";

              const isDestination =
                row.workingSide ===
                  "DESTINATION";

              return (
                <tr
                  key={row.id}
                  className="border-t transition hover:bg-slate-50/80"
                >

                  <td className="px-4 py-4">
                    <div className="font-bold text-[#0b2340]">
                      {row.trackingNumber}
                    </div>

                    <div className="mt-1 text-xs text-slate-400">
                      {row.senderName ||
                        "-"}
                      {" → "}
                      {row.receiverName ||
                        "-"}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-700">
                      {row.origin}
                    </span>

                    <span className="mx-2 text-[#ff7417]">
                      →
                    </span>

                    <span className="font-semibold text-slate-700">
                      {row.destination}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {row.bookingDate
                      ? new Date(
                          row.bookingDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </td>

                  <td className="px-4 py-4">

                    {isEmployee ? (
                      isOrigin ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                          <PlaneTakeoff
                            size={14}
                          />
                          Origin Working
                        </div>
                      ) : isDestination ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          <PlaneLanding
                            size={14}
                          />
                          Destination Working
                        </div>
                      ) : (
                        "-"
                      )
                    ) : (
                      <span className="text-slate-400">
                        Full Access
                      </span>
                    )}

                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {row.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    {row.chargeableWeight ??
                      0}
                    {" Kg"}
                  </td>

                  <td className="px-4 py-4">

                    {isEmployee ? (
                      hasNextAction ? (
                        <button
                          type="button"
                          onClick={() =>
                            openNextAction(
                              row
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-[#ff7417] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#e9680d]"
                        >
                          {nextActionLabel(
                            row.nextAction
                          )}

                          <ArrowRight
                            size={15}
                          />
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">
                          My work complete
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-500">
                        Admin access
                      </span>
                    )}

                  </td>

                  <td className="px-4 py-4">

                    <div className="flex items-center justify-end gap-2">

                      {hasSearched && (
                        <button
                          type="button"
                          title="Manage"
                          onClick={() =>
                            onSelect(row)
                          }
                          className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="Preview AWB"
                        onClick={() =>
                          window.open(
                            `/portal/docket/preview?tracking=${encodeURIComponent(
                              row.trackingNumber
                            )}`,
                            "_blank"
                          )
                        }
                        className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        title="Print AWB"
                        onClick={() =>
                          window.open(
                            `/api/airwaybill-pixel/${encodeURIComponent(
                              row.trackingNumber
                            )}`,
                            "_blank"
                          )
                        }
                        className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Printer
                          size={16}
                        />
                      </button>

                      {/*
                       * Generic Edit stays available
                       * for Admin/non-employee users.
                       *
                       * Employee editing will later
                       * follow Origin Working rules.
                       */}
                      {!isEmployee && (
                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            (window.location.href =
                              `/portal/operations/create-docket?tracking=${encodeURIComponent(
                                row.trackingNumber
                              )}`)
                          }
                          className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Pencil
                            size={16}
                          />
                        </button>
                      )}

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </section>
  );
}
