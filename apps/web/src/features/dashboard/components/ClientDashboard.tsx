"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Package,
  Plane,
  WalletCards,
} from "lucide-react";

type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string | null;
  trackingNumber: string | null;
  createdAt: string;
};

type WalletResponse = {
  client: {
    id: string;
    code: string;
    companyName: string;
    billingType: string;
    status: string;
  };

  wallet: {
    balance: number;
    transactions: WalletTransaction[];
  };
};

type Shipment = {
  id: string;
  trackingNumber: string;
  bookingDate?: string;
  createdAt?: string;
  origin: string;
  destination: string;
  status: string;
  chargeableWeight?: number;
  total?: number;
  totalAmount?: number;
  pricingSnapshot?: {
    totalAmount?: number;
    chargeableWeight?: number;
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
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-green-50 text-green-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    case "BOOKED":
      return "bg-blue-50 text-blue-700";
    case "OUT_FOR_DELIVERY":
      return "bg-purple-50 text-purple-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function shipmentAmount(shipment: Shipment) {
  return Number(
    shipment.pricingSnapshot?.totalAmount ??
      shipment.totalAmount ??
      shipment.total ??
      0,
  );
}

function shipmentWeight(shipment: Shipment) {
  return Number(
    shipment.pricingSnapshot?.chargeableWeight ??
      shipment.chargeableWeight ??
      0,
  );
}

export default function ClientDashboard() {
  const [walletData, setWalletData] = useState<WalletResponse | null>(null);

  const [shipments, setShipments] = useState<Shipment[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [walletResponse, bookingsResponse] = await Promise.all([
          fetch("/api/client/wallet", {
            cache: "no-store",
          }),

          fetch("/api/dockets", {
            cache: "no-store",
          }),
        ]);

        const walletJson = await walletResponse.json();

        const bookingsJson = await bookingsResponse.json();

        if (!walletResponse.ok) {
          throw new Error(walletJson?.error || "Unable to load wallet.");
        }

        if (!bookingsResponse.ok) {
          throw new Error(bookingsJson?.error || "Unable to load bookings.");
        }

        const rows = Array.isArray(bookingsJson)
          ? bookingsJson
          : Array.isArray(bookingsJson.shipments)
            ? bookingsJson.shipments
            : Array.isArray(bookingsJson.dockets)
              ? bookingsJson.dockets
              : Array.isArray(bookingsJson.data)
                ? bookingsJson.data
                : [];

        setWalletData(walletJson);
        setShipments(rows);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const delivered = useMemo(
    () =>
      shipments.filter((shipment) => shipment.status === "DELIVERED").length,
    [shipments],
  );

  const inTransit = useMemo(
    () =>
      shipments.filter(
        (shipment) =>
          !["BOOKED", "DELIVERED", "CANCELLED"].includes(shipment.status),
      ).length,
    [shipments],
  );

  const walletUsed = useMemo(
    () =>
      walletData?.wallet.transactions
        .filter((transaction) => transaction.type === "BOOKING_DEBIT")
        .reduce(
          (total, transaction) => total + Number(transaction.amount),
          0,
        ) ?? 0,
    [walletData],
  );

  const recentShipments = useMemo(
    () =>
      [...shipments]
        .sort((a, b) => {
          const bDate = b.bookingDate ?? b.createdAt ?? "";
          const aDate = a.bookingDate ?? a.createdAt ?? "";

          return new Date(bDate).getTime() - new Date(aDate).getTime();
        })
        .slice(0, 8),
    [shipments],
  );

  if (loading) {
    return (
      <div className="p-6 text-slate-500">Loading Client Dashboard...</div>
    );
  }

  if (error || !walletData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error || "Unable to load dashboard."}
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[#ff7417]">
          Client Dashboard
        </div>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome, {walletData.client.companyName}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Client ID:{" "}
          <span className="font-semibold text-slate-700">
            {walletData.client.code}
          </span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          title="Wallet Balance"
          value={money(walletData.wallet.balance)}
          icon={<WalletCards size={22} />}
        />

        <KpiCard
          title="Total Bookings"
          value={String(shipments.length)}
          icon={<Package size={22} />}
        />

        <KpiCard
          title="In Transit"
          value={String(inTransit)}
          icon={<Plane size={22} />}
        />

        <KpiCard
          title="Delivered"
          value={String(delivered)}
          icon={<CheckCircle2 size={22} />}
        />

        <KpiCard
          title="Wallet Used"
          value={money(walletUsed)}
          icon={<WalletCards size={22} />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction
          href="/portal/operations/create-docket"
          title="New Booking"
          description="Create a shipment using your contracted rate."
        />

        <QuickAction
          href="/portal/my-bookings"
          title="My Bookings"
          description="View shipments booked under your account."
        />

        <QuickAction
          href="/tracking"
          title="Track Shipment"
          description="Track a shipment using its AWB number."
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest shipments.
            </p>
          </div>

          <a
            href="/portal/my-bookings"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            View all
          </a>
        </div>

        {recentShipments.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={30} className="mx-auto text-slate-300" />

            <div className="mt-3 font-semibold text-slate-700">
              No bookings yet
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Your bookings will appear here.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">AWB</th>

                  <th className="px-6 py-4">Date</th>

                  <th className="px-6 py-4">Route</th>

                  <th className="px-6 py-4 text-right">Weight</th>

                  <th className="px-6 py-4 text-right">Amount</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4 text-right">Track</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                      {shipment.trackingNumber}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {formatDate(shipment.bookingDate ?? shipment.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <span>{shipment.origin}</span>

                        <ArrowRight size={14} className="text-slate-400" />

                        <span>{shipment.destination}</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-slate-700">
                      {shipmentWeight(shipment).toFixed(2)} kg
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900">
                      {money(shipmentAmount(shipment))}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          shipment.status,
                        )}`}
                      >
                        {statusLabel(shipment.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <a
                        href={`/tracking?trackingNumber=${encodeURIComponent(
                          shipment.trackingNumber,
                        )}`}
                        className="font-semibold text-blue-600 hover:text-blue-800"
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

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>

          <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>

        <div className="rounded-xl bg-orange-50 p-3 text-[#ff7417]">{icon}</div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="font-bold text-slate-900">{title}</div>

        <ArrowRight
          size={18}
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#ff7417]"
        />
      </div>

      <div className="mt-2 text-sm leading-6 text-slate-500">{description}</div>
    </a>
  );
}
