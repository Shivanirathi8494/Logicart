"use client";

import { useEffect, useMemo, useState } from "react";

import { ArrowRight, CheckCircle2, Package, Plane, Search } from "lucide-react";

type Shipment = {
  id: string;
  trackingNumber: string;
  bookingDate?: string;
  createdAt?: string;
  origin: string;
  destination: string;
  status: string;
  actualWeight?: number;
  volumetricWeight?: number;
  chargeableWeight?: number;
  total?: number;

  pricingSnapshot?: {
    chargeableWeight?: number;
    totalAmount?: number;
  } | null;
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-200";

    case "OUT_FOR_DELIVERY":
      return "bg-orange-50 text-orange-700 ring-orange-200";

    case "BOOKED":
      return "bg-blue-50 text-blue-700 ring-blue-200";

    default:
      return "bg-violet-50 text-violet-700 ring-violet-200";
  }
}

function amount(shipment: Shipment) {
  return Number(shipment.pricingSnapshot?.totalAmount ?? shipment.total ?? 0);
}

function weight(shipment: Shipment) {
  return Number(
    shipment.pricingSnapshot?.chargeableWeight ??
      shipment.chargeableWeight ??
      0,
  );
}

export default function MyBookingsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const response = await fetch("/api/dockets", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error ?? "Unable to load bookings.");
        }

        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data.shipments)
            ? data.shipments
            : Array.isArray(data.dockets)
              ? data.dockets
              : Array.isArray(data.data)
                ? data.data
                : [];

        setShipments(rows);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to load bookings.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return shipments;
    }

    return shipments.filter((shipment) =>
      [
        shipment.trackingNumber,
        shipment.origin,
        shipment.destination,
        shipment.status,
      ].some((field) =>
        String(field ?? "")
          .toLowerCase()
          .includes(value),
      ),
    );
  }, [shipments, search]);

  const delivered = shipments.filter(
    (shipment) => shipment.status === "DELIVERED",
  ).length;

  const inTransit = shipments.filter(
    (shipment) =>
      !["BOOKED", "DELIVERED", "CANCELLED"].includes(shipment.status),
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff7417]">
          Client Portal
        </div>

        <h1 className="mt-2 text-3xl font-black text-[#0b2340]">My Bookings</h1>

        <p className="mt-1 text-sm text-slate-500">
          View and track shipments booked under your client account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Bookings"
          value={shipments.length}
          icon={<Package size={20} />}
        />

        <SummaryCard
          title="In Transit"
          value={inTransit}
          icon={<Plane size={20} />}
        />

        <SummaryCard
          title="Delivered"
          value={delivered}
          icon={<CheckCircle2 size={20} />}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search AWB, route or status"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#ff7417] focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading bookings...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={32} className="mx-auto text-slate-300" />

            <div className="mt-3 font-semibold text-slate-700">
              No bookings found
            </div>

            <div className="mt-1 text-sm text-slate-500">
              New client bookings will appear here.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">AWB</th>

                  <th className="px-5 py-4">Booking Date</th>

                  <th className="px-5 py-4">Route</th>

                  <th className="px-5 py-4 text-right">Chargeable Weight</th>

                  <th className="px-5 py-4 text-right">Amount</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 font-bold text-[#0b2340]">
                      {shipment.trackingNumber}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(shipment.bookingDate ?? shipment.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <span>{shipment.origin}</span>

                        <ArrowRight size={14} className="text-slate-400" />

                        <span>{shipment.destination}</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right text-slate-700">
                      {weight(shipment).toFixed(2)} kg
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-slate-900">
                      {money(amount(shipment))}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClass(
                          shipment.status,
                        )}`}
                      >
                        {statusLabel(shipment.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <a
                        href={`/tracking?trackingNumber=${encodeURIComponent(
                          shipment.trackingNumber,
                        )}`}
                        className="font-bold text-blue-600 hover:text-blue-800"
                      >
                        Track
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>

          <div className="mt-2 text-2xl font-black text-[#0b2340]">{value}</div>
        </div>

        <div className="rounded-xl bg-orange-50 p-3 text-[#ff7417]">{icon}</div>
      </div>
    </div>
  );
}
