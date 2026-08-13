"use client";

import { useState } from "react";

export type ReportFilters = {
  fromDate: string;
  toDate: string;
  origin: string;
  status: string;
};

type Props = {
  title: string;
  children?: React.ReactNode;
  onSearch?: (filters: ReportFilters) => void;
  onReset?: () => void;
  showOrigin?: boolean;
  statusOptions?: string[];
};

export default function ReportLayout({
  title,
  children,
  onSearch,
  onReset,
  showOrigin = true,
  statusOptions = [],
}: Props) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [origin, setOrigin] = useState("");
  const [status, setStatus] = useState("");

  function handleSearch() {
    onSearch?.({
      fromDate,
      toDate,
      origin,
      status,
    });
  }

  function handleReset() {
    setFromDate("");
    setToDate("");
    setOrigin("");
    setStatus("");
    onReset?.();
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="mt-2 text-slate-500">
            Generate and export reports.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border px-5 py-3"
          >
            Print
          </button>

          <button
            type="button"
            className="rounded-lg bg-green-600 px-5 py-3 text-white"
          >
            Export Excel
          </button>

        </div>

      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div
          className={`grid gap-4 ${
            showOrigin ? "md:grid-cols-4" : "md:grid-cols-3"
          }`}
        >

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border p-3"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border p-3"
          />

          {showOrigin && (
            <input
              type="text"
              value={origin}
              onChange={(e) =>
                setOrigin(e.target.value.toUpperCase())
              }
              placeholder="Origin"
              className="rounded-lg border p-3"
            />
          )}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border p-3"
          >
            <option value="">All Status</option>

            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

        </div>

        <div className="mt-4 flex gap-3">

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border px-6 py-3"
          >
            Reset
          </button>

        </div>

      </div>

      {children}

    </div>
  );
}
