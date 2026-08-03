"use client";

import { useEffect, useState } from "react";

import KPICards from "./components/KPICards";
import ShipmentStatusCard from "./components/ShipmentStatusCard";
import RecentShipments from "./components/RecentShipments";
import RecentManifests from "./components/RecentManifests";
import ShipmentStatusChart from "./components/ShipmentStatusChart";
import OperationsSummary from "./components/OperationsSummary";
import QuickActions from "./components/QuickActions";

export default function DashboardPage() {

  const [dashboard, setDashboard] = useState<any>();

  useEffect(() => {
    load();
  }, []);

  async function load() {

    const response = await fetch("/api/dashboard");

    const data = await response.json();

    setDashboard(data);

  }

  if (!dashboard) {

    return (
      <div className="p-10">
        Loading Dashboard...
      </div>
    );

  }

  return (

    <div className="space-y-8">

      <KPICards dashboard={dashboard} />

      <QuickActions />

      <div className="grid gap-8 lg:grid-cols-2">

        <ShipmentStatusCard dashboard={dashboard} />

        <OperationsSummary dashboard={dashboard} />

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <ShipmentStatusChart dashboard={dashboard} />

        <RecentManifests dashboard={dashboard} />

      </div>

      <RecentShipments dashboard={dashboard} />

    </div>

  );

}
