"use client";

import {
  useEffect,
  useState,
} from "react";

type RequestRow = {
  id: string;
  requestNumber: string;
  type: string;
  companyName: string;
  contactPerson: string;
  status: string;
  financeStatus: string;
  mdStatus: string;
  createdAt: string;
};

export default function OnboardingStatusPage() {
  const [rows, setRows] =
    useState<RequestRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetch("/api/onboarding")
      .then(async (response) => {
        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load requests."
          );
        }

        setRows(data);
      })
      .catch((error) =>
        setError(error.message)
      )
      .finally(() =>
        setLoading(false)
      );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Onboarding Requests
        </h1>

        <p className="mt-2 text-slate-500">
          Track Client and Agent approval status.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">
                Request ID
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Company
              </th>

              <th className="p-4 text-left">
                Finance
              </th>

              <th className="p-4 text-left">
                MD
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t"
              >
                <td className="p-4 font-semibold">
                  {row.requestNumber}
                </td>

                <td className="p-4">
                  {row.type}
                </td>

                <td className="p-4">
                  {row.companyName ||
                    "-"}
                </td>

                <td className="p-4">
                  {row.financeStatus}
                </td>

                <td className="p-4">
                  {row.mdStatus}
                </td>

                <td className="p-4">
                  {row.status}
                </td>

                <td className="p-4">
                  {new Date(
                    row.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-6 text-slate-500">
            Loading...
          </div>
        )}

        {error && (
          <div className="p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          rows.length === 0 && (
            <div className="p-6 text-slate-500">
              No onboarding requests yet.
            </div>
          )}
      </div>
    </div>
  );
}
