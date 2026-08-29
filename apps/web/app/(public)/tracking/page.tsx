"use client";

import { Suspense, useCallback, useEffect, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Plane,
  Search,
  Truck,
} from "lucide-react";

import { useSearchParams } from "next/navigation";

import PageContainer from "@/components/page/PageContainer";
import PageHero from "@/components/page/PageHero";

type TrackingEvent = {
  id: string;
  status: string;
  eventType: string;
  title: string;

  location: {
    code: string;
    name: string;
  };

  eventAt: string;
  remarks?: string | null;
};

type TrackingResult = {
  trackingNumber: string;

  origin: {
    code: string;
    name: string;
  };

  destination: {
    code: string;
    name: string;
  };

  currentStatus: string;
  currentStatusTitle: string;

  currentLocation: {
    code: string;
    name: string;
  };

  lastUpdatedAt: string;

  events: TrackingEvent[];
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusIcon(status: string) {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle2 size={20} />;

    case "OUT_FOR_DELIVERY":
      return <Truck size={20} />;

    case "MANIFESTED":
      return <Plane size={20} />;

    default:
      return <PackageCheck size={20} />;
  }
}

function statusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "OUT_FOR_DELIVERY":
      return "bg-orange-50 text-orange-700 ring-orange-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-blue-50 text-blue-700 ring-blue-200";
  }
}

function TrackingContent() {
  const searchParams = useSearchParams();

  const [trackingNumber, setTrackingNumber] = useState(
    searchParams.get("trackingNumber") ?? "",
  );

  const [shipment, setShipment] = useState<TrackingResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const search = useCallback(
    async (options?: { silent?: boolean }) => {
      const value = trackingNumber.trim().toUpperCase();

      if (!value) {
        return;
      }

      const silent = options?.silent === true;

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setShipment(null);
      }

      setError("");

      try {
        const response = await fetch(
          `/api/dockets/${encodeURIComponent(value)}/status`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (!silent) {
            setShipment(null);
          }

          setError(data?.error ?? "Shipment not found.");

          return;
        }

        setShipment(data);
      } catch (err) {
        console.error("Tracking failed:", err);

        setError("Unable to load shipment tracking.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [trackingNumber],
  );

  useEffect(() => {
    if (searchParams.get("trackingNumber")) {
      void search();
    }
  }, [searchParams, search]);

  /*
   * Near-real-time tracking.
   *
   * Operational scans are event-based,
   * so refreshing every 15 seconds is
   * sufficient without requiring GPS
   * or WebSocket infrastructure.
   */
  useEffect(() => {
    if (
      !shipment ||
      shipment.currentStatus === "DELIVERED" ||
      shipment.currentStatus === "CANCELLED"
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      void search({
        silent: true,
      });
    }, 15000);

    return () => {
      window.clearInterval(timer);
    };
  }, [shipment, search]);

  return (
    <>
      <PageHero
        title="Track Your Shipment"
        subtitle="Follow your shipment journey from booking to final delivery."
      />

      <PageContainer>
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={trackingNumber}
                  onChange={(e) =>
                    setTrackingNumber(e.target.value.toUpperCase())
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void search();
                    }
                  }}
                  className="min-h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base font-medium text-[#0b2340] outline-none transition focus:border-[#ff7417] focus:ring-4 focus:ring-orange-100"
                  placeholder="Enter AWB Number"
                />
              </div>

              <button
                type="button"
                onClick={() => void search()}
                disabled={loading}
                className="min-h-14 rounded-xl bg-[#ff7417] px-8 font-bold text-white transition hover:bg-[#e9680d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Tracking..." : "Track Shipment"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
          </div>

          {shipment && (
            <>
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-[#0b2340] to-[#163b63] p-6 text-white sm:p-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                        AWB Number
                      </div>

                      <div className="mt-2 text-2xl font-black tracking-wide sm:text-3xl">
                        {shipment.trackingNumber}
                      </div>
                    </div>

                    <div
                      className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${statusClass(
                        shipment.currentStatus,
                      )}`}
                    >
                      {statusIcon(shipment.currentStatus)}

                      {shipment.currentStatusTitle}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <MapPin size={17} />
                      Current Location
                    </div>

                    <div className="mt-3 text-xl font-black text-[#0b2340]">
                      {shipment.currentLocation.code}
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      {shipment.currentLocation.name}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Clock3 size={17} />
                      Last Updated
                    </div>

                    <div className="mt-3 font-bold text-[#0b2340]">
                      {formatDateTime(shipment.lastUpdatedAt)}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {refreshing
                        ? "Refreshing latest status..."
                        : "Automatically refreshes every 15 seconds"}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2 lg:col-span-1">
                    <div className="text-sm font-semibold text-slate-500">
                      Route
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div>
                        <div className="font-black text-[#0b2340]">
                          {shipment.origin.code}
                        </div>

                        <div className="text-xs text-slate-500">
                          {shipment.origin.name}
                        </div>
                      </div>

                      <div className="flex flex-1 items-center gap-2">
                        <div className="h-px flex-1 bg-slate-300" />
                        <Plane size={18} className="text-[#ff7417]" />
                        <div className="h-px flex-1 bg-slate-300" />
                      </div>

                      <div className="text-right">
                        <div className="font-black text-[#0b2340]">
                          {shipment.destination.code}
                        </div>

                        <div className="text-xs text-slate-500">
                          {shipment.destination.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff7417]">
                    Live Tracking
                  </div>

                  <h2 className="mt-2 text-2xl font-black text-[#0b2340]">
                    Shipment Journey
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest airport scans and shipment status updates.
                  </p>
                </div>

                {shipment.events.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Detailed tracking history is not available for this older
                    shipment.
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute bottom-5 left-[19px] top-5 w-px bg-slate-200" />

                    <div className="space-y-1">
                      {[...shipment.events].reverse().map((event, index) => (
                        <div
                          key={event.id}
                          className="relative flex gap-5 pb-7"
                        >
                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                              index === 0
                                ? "bg-[#ff7417] text-white"
                                : "bg-[#0b2340] text-white"
                            }`}
                          >
                            {statusIcon(event.status)}
                          </div>

                          <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <div className="font-bold text-[#0b2340]">
                                  {event.title}
                                </div>

                                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                                  <MapPin size={14} />

                                  <span className="font-semibold">
                                    {event.location.code}
                                  </span>

                                  <span>—</span>

                                  <span>{event.location.name}</span>
                                </div>
                              </div>

                              <div className="shrink-0 text-xs font-medium text-slate-500">
                                {formatDateTime(event.eventAt)}
                              </div>
                            </div>

                            {event.remarks && (
                              <div className="mt-3 text-sm leading-6 text-slate-600">
                                {event.remarks}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </PageContainer>
    </>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          Loading tracking...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
