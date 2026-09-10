"use client";

import { useCallback, useEffect, useState } from "react";

type ArchiveShipment = {
  trackingNumber: string;
  archivedAt: string;
};

type DeliveredArchive = {
  id: string;
  periodStart: string;
  periodEnd: string;
  shipmentCount: number;
  fileName: string | null;
  fileSize: string | null;
  checksum: string | null;
  status: "CREATING" | "VERIFIED" | "FAILED";
  failureReason: string | null;
  createdAt: string;
  verifiedAt: string | null;
  shipments: ArchiveShipment[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatPeriodDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatBytes(value: string | null) {
  if (!value) return "—";

  const bytes = Number(value);

  if (!Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DeliveredArchivesPage() {
  const [archives, setArchives] = useState<DeliveredArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadArchives = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/admin/delivered-archives", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load archives.");
      }

      setArchives(data.archives ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load archives.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArchives();
  }, [loadArchives]);

  async function runArchive() {
    if (
      !window.confirm(
        "Create the archive for the last completed 7-day period? This does not delete any shipment data.",
      )
    ) {
      return;
    }

    try {
      setRunning(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/admin/delivered-archives/run", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Archive creation failed.");
      }

      if (data.created) {
        setMessage(
          `Archive verified successfully. ${data.shipmentCount} AWB(s) archived.`,
        );
      } else {
        setMessage(data.reason || "No archive was required.");
      }

      await loadArchives();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive creation failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Delivered Archives
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Verified 7-day backups of completed shipment records.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Archive creation does not delete live shipment data.
          </p>
        </div>

        <button
          type="button"
          onClick={runArchive}
          disabled={running}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Creating archive..." : "Run 7-Day Archive"}
        </button>
      </div>

      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading archives...
          </div>
        ) : archives.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-slate-700">
              No delivered archives yet.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              An archive will appear here after a completed 7-day period
              contains delivered AWBs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    AWBs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Verified
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {archives.map((archive) => (
                  <tr key={archive.id}>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                      {formatPeriodDate(archive.periodStart)}
                      {" – "}
                      {formatPeriodDate(
                        new Date(
                          new Date(archive.periodEnd).getTime() - 1,
                        ).toISOString(),
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-slate-900">
                      {archive.shipmentCount}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                      {formatBytes(archive.fileSize)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          archive.status === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-700"
                            : archive.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {archive.status}
                      </span>

                      {archive.failureReason ? (
                        <p className="mt-1 max-w-xs text-xs text-red-600">
                          {archive.failureReason}
                        </p>
                      ) : null}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                      {archive.verifiedAt
                        ? formatDate(archive.verifiedAt)
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      {archive.status === "VERIFIED" ? (
                        <a
                          href={`/api/admin/delivered-archives/${archive.id}/download`}
                          className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
                        >
                          Download ZIP
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Unavailable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">Archive protection</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Downloads are allowed only for VERIFIED archives. The stored ZIP is
          read again and its SHA-256 checksum is validated before download.
        </p>
      </div>
    </div>
  );
}
