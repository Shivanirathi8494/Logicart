"use client";

import {
  useEffect,
  useState,
} from "react";

export default function LoadingTallyList({
  onSelect,
}: any) {

  const [rows, setRows] =
    useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const response =
      await fetch(
        "/api/loading-tallies/open"
      );

    if (response.ok) {
      setRows(
        await response.json()
      );
    }
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
        No open Loading Tallies.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      {/* MOBILE */}
      <div className="divide-y md:hidden">

        {rows.map((row: any) => (
          <div
            key={row.id}
            className="p-4"
          >

            <div className="break-all font-bold text-[#0b2340]">
              {row.loadingTallyNumber}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">

              <div>
                <div className="text-xs text-slate-400">
                  Date
                </div>

                <div className="mt-1 font-medium text-slate-700">
                  {new Date(
                    row.loadingDate
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400">
                  Shipments
                </div>

                <div className="mt-1 font-semibold text-slate-700">
                  {row.shipments?.length ?? 0}
                </div>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                onSelect(row)
              }
              className="mt-4 min-h-11 w-full rounded-lg bg-[#ff7417] px-4 py-2.5 font-semibold text-white transition hover:bg-[#e9680d]"
            >
              Open Loading Tally
            </button>

          </div>
        ))}

      </div>


      {/* DESKTOP */}
      <div className="hidden overflow-x-auto md:block">

        <table className="w-full">

          <thead className="bg-slate-50">
            <tr className="border-b">

              <th className="p-4 text-left">
                Loading Tally
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Shipments
              </th>

              <th className="p-4 text-right">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {rows.map((row: any) => (
              <tr
                key={row.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >

                <td className="p-4 font-semibold text-[#0b2340]">
                  {row.loadingTallyNumber}
                </td>

                <td className="p-4">
                  {new Date(
                    row.loadingDate
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </td>

                <td className="p-4">
                  {row.shipments?.length ?? 0}
                </td>

                <td className="p-4 text-right">

                  <button
                    type="button"
                    onClick={() =>
                      onSelect(row)
                    }
                    className="rounded-lg bg-[#ff7417] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e9680d]"
                  >
                    Open
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
