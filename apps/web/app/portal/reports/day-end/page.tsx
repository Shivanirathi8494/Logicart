"use client";

import { useEffect, useState } from "react";

import ReportLayout from "@/features/reports/components/ReportLayout";
import ReportSummary from "@/features/reports/components/ReportSummary";
import ReportTable from "@/features/reports/components/ReportTable";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/day-end", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load Day End report.");
        }

        setData(await response.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <ReportLayout title="Day End Report">
        <div className="rounded-xl border bg-white p-8 text-slate-500">
          Loading Day End report...
        </div>
      </ReportLayout>
    );
  }

  if (!data) {
    return (
      <ReportLayout title="Day End Report">
        <div className="rounded-xl border bg-white p-8 text-red-600">
          Unable to load Day End report.
        </div>
      </ReportLayout>
    );
  }

  return (
    <ReportLayout title="Day End Report">

      <ReportSummary
        cards={[
          {
            title: "Bookings",
            value: data.bookingCount,
          },
          {
            title: "Manifests",
            value: data.manifestCount,
          },
          {
            title: "Outscan",
            value: data.outscanCount,
          },
          {
            title: "Delivered",
            value: data.deliveredCount,
          },
          {
            title: "Pending Delivery",
            value: data.pendingDelivery,
          },
          {
            title: "Revenue",
            value: `₹${Number(data.revenue || 0).toLocaleString("en-IN")}`,
          },
        ]}
      />

      <ReportTable
        headers={[
          "Business Date",
          "Branch",
          "Bookings",
          "Manifests",
          "Outscan",
          "Delivered",
          "Pending",
          "Revenue",
          "Status",
        ]}
        rows={[
          [
            new Date(data.businessDate).toLocaleDateString("en-GB"),
            data.branch,
            data.bookingCount,
            data.manifestCount,
            data.outscanCount,
            data.deliveredCount,
            data.pendingDelivery,
            `₹${Number(data.revenue || 0).toLocaleString("en-IN")}`,
            "Open",
          ],
        ]}
      />

    </ReportLayout>
  );
}
