"use client";

import { useEffect, useState } from "react";

import KPICards from "./components/KPICards";
import ShipmentStatusCard from "./components/ShipmentStatusCard";
import RecentShipments from "./components/RecentShipments";
import RecentManifests from "./components/RecentManifests";
import ShipmentStatusChart from "./components/ShipmentStatusChart";
import OperationsSummary from "./components/OperationsSummary";
import ClientDashboard from "./components/ClientDashboard";

import { authFetch } from "@/lib/api/authFetch";

const emptyDashboard = {
  booked: 0,
  inscan: 0,
  manifested: 0,
  received: 0,
  outscan: 0,
  delivered: 0,

  totalShipment: 0,
  totalManifest: 0,
  totalChallan: 0,
  pendingDelivery: 0,

  openManifests: 0,
  openChallans: 0,

  recentShipments: [],
  recentManifests: [],
};

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  const [dashboard, setDashboard] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function initialize() {
      try {
        const authResponse = await authFetch("/api/auth/me", {
          cache: "no-store",
        });

        const user = await authResponse.json();

        if (authResponse.ok && user?.role === "CLIENT") {
          setRole("CLIENT");
          setLoading(false);
          return;
        }

        setRole(user?.role ?? "UNKNOWN");

        await load();
      } catch (error) {
        console.error("Dashboard initialization failed:", error);

        setError(
          error instanceof Error ? error.message : "Unable to load dashboard.",
        );

        setLoading(false);
      }
    }

    void initialize();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError("");

      const response = await authFetch("/api/dashboard", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load dashboard.");
      }

      /*
       * Normalize the response so every
       * dashboard component always receives
       * valid values.
       */
      setDashboard({
        ...emptyDashboard,
        ...data,

        recentShipments: Array.isArray(data.recentShipments)
          ? data.recentShipments
          : [],

        recentManifests: Array.isArray(data.recentManifests)
          ? data.recentManifests
          : [],
      });
    } catch (error) {
      console.error("Dashboard load failed:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (role === "CLIENT") {
    return <ClientDashboard />;
  }

  if (loading) {
    return <div className="p-6 text-slate-500">Loading Dashboard...</div>;
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-bold text-[#0b2340]">Unable to load dashboard</h2>

        <p className="mt-2 text-sm text-slate-500">{error}</p>

        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-lg bg-[#0b2340] px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <KPICards dashboard={dashboard} />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <ShipmentStatusCard dashboard={dashboard} />

        <OperationsSummary dashboard={dashboard} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <ShipmentStatusChart dashboard={dashboard} />

        <RecentManifests dashboard={dashboard} />
      </div>

      <RecentShipments dashboard={dashboard} />
    </div>
  );
}
