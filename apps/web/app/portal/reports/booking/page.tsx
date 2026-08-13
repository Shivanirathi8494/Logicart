"use client";

import { useEffect, useState } from "react";

import ReportLayout, {
  ReportFilters,
} from "@/features/reports/components/ReportLayout";
import ReportSummary from "@/features/reports/components/ReportSummary";
import ReportTable from "@/features/reports/components/ReportTable";

export default function Page() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadShipments() {
    try {
      setLoading(true);

      const response = await fetch("/api/dockets", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load bookings.");
      }

      const data = await response.json();

      setShipments(data);
      setFiltered(data);
    } catch (error) {
      console.error(error);
      setShipments([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShipments();
  }, []);

  function applyFilters(filters: ReportFilters) {
    let rows = [...shipments];

    if (filters.fromDate) {
      const from = new Date(`${filters.fromDate}T00:00:00`);

      rows = rows.filter((shipment) => {
        const date = new Date(shipment.createdAt);
        return date >= from;
      });
    }

    if (filters.toDate) {
      const to = new Date(`${filters.toDate}T23:59:59.999`);

      rows = rows.filter((shipment) => {
        const date = new Date(shipment.createdAt);
        return date <= to;
      });
    }

    if (filters.origin) {
      rows = rows.filter(
        (shipment) =>
          shipment.origin?.toUpperCase() ===
          filters.origin.toUpperCase()
      );
    }

    if (filters.status) {
      rows = rows.filter(
        (shipment) => shipment.status === filters.status
      );
    }

    setFiltered(rows);
  }

  function resetFilters() {
    setFiltered(shipments);
  }

  const totalBookings = filtered.length;

  const totalRevenue = filtered.reduce(
    (sum, shipment) =>
      sum + Number(shipment.total ?? 0),
    0
  );

  const totalWeight = filtered.reduce(
    (sum, shipment) =>
      sum + Number(shipment.chargeableWeight ?? 0),
    0
  );

  const delivered = filtered.filter(
    (shipment) => shipment.status === "DELIVERED"
  ).length;

  const rows = filtered.map((shipment) => [
    shipment.trackingNumber ?? "",
    shipment.origin ?? "",
    shipment.destination ?? "",
    shipment.receiverName ?? "",
    `${Number(
      shipment.chargeableWeight ?? 0
    ).toFixed(2)} Kg`,
    `₹${Number(
      shipment.total ?? 0
    ).toLocaleString("en-IN")}`,
    shipment.status ?? "",
  ]);

  return (
    <ReportLayout
      title="Booking Report"
      onSearch={applyFilters}
      onReset={resetFilters}
      statusOptions={[
        "BOOKED",
        "MANIFESTED",
        "INSCAN",
        "OUTSCAN",
        "DELIVERED",
      ]}
    >
      <ReportSummary
        cards={[
          {
            title: "Total Bookings",
            value: loading ? "..." : totalBookings,
          },
          {
            title: "Revenue",
            value: loading
              ? "..."
              : `₹${totalRevenue.toLocaleString("en-IN")}`,
          },
          {
            title: "Total Weight",
            value: loading
              ? "..."
              : `${totalWeight.toFixed(2)} Kg`,
          },
          {
            title: "Delivered",
            value: loading ? "..." : delivered,
          },
        ]}
      />

      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-slate-500">
          Loading booking records...
        </div>
      ) : (
        <ReportTable
          headers={[
            "Tracking No",
            "Origin",
            "Destination",
            "Customer",
            "Weight",
            "Amount",
            "Status",
          ]}
          rows={rows}
        />
      )}
    </ReportLayout>
  );
}
