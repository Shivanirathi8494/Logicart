"use client";

import { useMemo, useState } from "react";

type PackageState = {
  packageId: string;
  shipmentId: string;
  trackingNumber: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  unloaded: boolean;
  remarks: string;
};

export default function InscanManifestTable({ manifest }: any) {
  /*
   * Only pieces physically loaded at origin should be
   * expected at destination.
   */
  const loadedPackages = useMemo(() => {
    const tallyPackages = manifest.loadingTally?.packages ?? [];

    return tallyPackages.filter((item: any) => item.loaded);
  }, [manifest]);

  /*
   * Existing unload records are used when reopening
   * a manifest that was already partially verified.
   */
  const existingUnloadMap = useMemo(
    () =>
      new Map(
        (manifest.unloadPackages ?? []).map((item: any) => [
          item.packageId,
          item,
        ]),
      ),
    [manifest],
  );

  /*
   * Map package -> shipment/AWB.
   */
  const shipmentByPackageId = useMemo(() => {
    const map = new Map<
      string,
      {
        shipmentId: string;
        trackingNumber: string;
      }
    >();

    for (const entry of manifest.shipments ?? []) {
      for (const pkg of entry.shipment?.packages ?? []) {
        map.set(pkg.id, {
          shipmentId: entry.shipment.id,
          trackingNumber: entry.shipment.trackingNumber,
        });
      }
    }

    return map;
  }, [manifest]);

  const initialPackages = useMemo<PackageState[]>(() => {
    return loadedPackages
      .map((entry: any) => {
        const pkg = entry.package;

        const shipment = shipmentByPackageId.get(pkg.id);

        const existing = existingUnloadMap.get(pkg.id) as any;

        return {
          packageId: pkg.id,

          shipmentId: shipment?.shipmentId ?? pkg.shipmentId ?? "",

          trackingNumber: shipment?.trackingNumber ?? "Unknown AWB",

          weight: Number(pkg.weight ?? 0),

          length: Number(pkg.length ?? 0),

          width: Number(pkg.width ?? 0),

          height: Number(pkg.height ?? 0),

          /*
           * New manifest:
           * all loaded pieces are expected to arrive.
           *
           * Existing verification:
           * restore saved unload decision.
           */
          unloaded: existing?.unloaded ?? true,

          remarks: existing?.remarks ?? "",
        };
      })
      .filter((pkg: PackageState) => Boolean(pkg.packageId));
  }, [loadedPackages, existingUnloadMap, shipmentByPackageId]);

  const [packages, setPackages] = useState<PackageState[]>(initialPackages);

  const [saving, setSaving] = useState(false);

  function togglePackage(packageId: string) {
    setPackages((current) =>
      current.map((pkg) =>
        pkg.packageId === packageId
          ? {
              ...pkg,
              unloaded: !pkg.unloaded,
              remarks: pkg.unloaded ? pkg.remarks : "",
            }
          : pkg,
      ),
    );
  }

  function updateRemark(packageId: string, remarks: string) {
    setPackages((current) =>
      current.map((pkg) =>
        pkg.packageId === packageId
          ? {
              ...pkg,
              remarks,
            }
          : pkg,
      ),
    );
  }

  function setAll(unloaded: boolean) {
    setPackages((current) =>
      current.map((pkg) => ({
        ...pkg,
        unloaded,
        remarks: unloaded ? "" : pkg.remarks,
      })),
    );
  }

  const totalPieces = packages.length;

  const unloadedPieces = packages.filter((pkg) => pkg.unloaded).length;

  const notUnloadedPieces = totalPieces - unloadedPieces;

  const unloadedWeight = packages.reduce(
    (sum, pkg) => (pkg.unloaded ? sum + pkg.weight : sum),
    0,
  );

  const allSelected = totalPieces > 0 && unloadedPieces === totalPieces;

  /*
   * Group packages by AWB.
   */
  const shipmentGroups = useMemo(() => {
    const groups = new Map<string, PackageState[]>();

    for (const pkg of packages) {
      const key = pkg.trackingNumber;

      const current = groups.get(key) ?? [];

      current.push(pkg);

      groups.set(key, current);
    }

    return Array.from(groups.entries());
  }, [packages]);

  async function completeUnload() {
    if (!packages.length) {
      alert("No loaded packages found for this manifest.");

      return;
    }

    const missingRemark = packages.find(
      (pkg) => !pkg.unloaded && !pkg.remarks.trim(),
    );

    if (missingRemark) {
      alert(
        `Please enter remarks for the missing piece in AWB ${missingRemark.trackingNumber}.`,
      );

      return;
    }

    const confirmed = confirm(
      notUnloadedPieces > 0
        ? `Complete unload with ${notUnloadedPieces} piece(s) not received?`
        : `Confirm all ${totalPieces} piece(s) received?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/manifests/${encodeURIComponent(manifest.manifestNumber)}/unload`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            packages: packages.map((pkg) => ({
              packageId: pkg.packageId,

              unloaded: pkg.unloaded,

              remarks: pkg.remarks.trim() || null,
            })),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Unable to complete unload.");

        return;
      }

      /*
       * Close only when every manifested
       * piece was received.
       *
       * A partial unload remains open so
       * missing pieces remain operationally
       * visible.
       */
      if (data.summary?.notUnloadedPieces === 0) {
        const closeResponse = await fetch(
          `/api/manifests/${encodeURIComponent(manifest.manifestNumber)}/close`,
          {
            method: "PATCH",
          },
        );

        if (!closeResponse.ok) {
          console.error("Unload saved, but manifest could not be closed.");
        }
      }

      alert(
        data.summary?.notUnloadedPieces > 0
          ? `Unload saved. ${data.summary.notUnloadedPieces} piece(s) are still missing.`
          : "All manifested pieces received successfully.",
      );

      location.reload();
    } catch (error) {
      console.error(error);

      alert("Unable to complete unload.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b p-4 sm:p-5">
        <h2 className="break-all text-lg font-semibold text-[#0b2340] sm:text-xl">
          Manifest : {manifest.manifestNumber}
        </h2>

        <div className="mt-2 text-sm text-slate-500 sm:text-base">
          Origin : {manifest.origin}
          <span className="mx-2 text-[#ff7417]">→</span>
          Destination : {manifest.destination}
        </div>
      </div>

      {/* PACKAGE TOTALS */}
      <div className="grid grid-cols-2 gap-3 border-b bg-slate-50 p-4 sm:grid-cols-4 sm:p-5">
        <div className="rounded-lg border bg-white p-3">
          <div className="text-xs font-medium text-slate-500">Total Pieces</div>

          <div className="mt-1 text-xl font-bold text-[#0b2340]">
            {totalPieces}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3">
          <div className="text-xs font-medium text-slate-500">Unloading</div>

          <div className="mt-1 text-xl font-bold text-green-700">
            {unloadedPieces}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3">
          <div className="text-xs font-medium text-slate-500">Not Unloaded</div>

          <div className="mt-1 text-xl font-bold text-red-600">
            {notUnloadedPieces}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3">
          <div className="text-xs font-medium text-slate-500">
            Unloaded Weight
          </div>

          <div className="mt-1 text-xl font-bold text-[#0b2340]">
            {unloadedWeight.toFixed(2)} Kg
          </div>
        </div>
      </div>

      {/* SELECT ALL */}
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={allSelected}
            onChange={(e) => setAll(e.target.checked)}
          />
          All manifested pieces received
        </label>

        <div className="text-xs text-slate-500">
          Verify physical pieces before completing unload.
        </div>
      </div>

      {/* MOBILE */}
      <div className="divide-y md:hidden">
        {shipmentGroups.map(([trackingNumber, shipmentPackages]) => (
          <div key={trackingNumber} className="p-4">
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                AWB
              </div>

              <div className="break-all font-bold text-[#0b2340]">
                {trackingNumber}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {shipmentPackages.length} manifested piece(s)
              </div>
            </div>

            <div className="space-y-3">
              {shipmentPackages.map((pkg, index) => (
                <div
                  key={pkg.packageId}
                  className={`rounded-xl border p-4 ${
                    pkg.unloaded
                      ? "border-green-200 bg-green-50/40"
                      : "border-red-200 bg-red-50/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 shrink-0"
                      checked={pkg.unloaded}
                      onChange={() => togglePackage(pkg.packageId)}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-semibold text-[#0b2340]">
                          Piece {index + 1} of {shipmentPackages.length}
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            pkg.unloaded
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pkg.unloaded ? "RECEIVED" : "MISSING"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-slate-400">Weight</div>

                          <div className="mt-1 font-semibold">
                            {pkg.weight.toFixed(2)} Kg
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-slate-400">
                            Dimensions
                          </div>

                          <div className="mt-1 font-semibold">
                            {pkg.length} × {pkg.width} × {pkg.height} cm
                          </div>
                        </div>
                      </div>

                      {!pkg.unloaded && (
                        <div className="mt-3">
                          <label className="mb-1 block text-xs font-semibold text-red-700">
                            Remarks *
                          </label>

                          <input
                            type="text"
                            value={pkg.remarks}
                            onChange={(e) =>
                              updateRemark(pkg.packageId, e.target.value)
                            }
                            placeholder="Why was this piece not unloaded?"
                            className="min-h-11 w-full rounded-lg border border-red-200 bg-white p-3 text-base outline-none focus:border-red-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-center">Unload</th>

              <th className="p-3 text-left">AWB Number</th>

              <th className="p-3 text-left">Piece</th>

              <th className="p-3 text-right">Weight</th>

              <th className="p-3 text-left">Dimensions</th>

              <th className="p-3 text-left">Remarks</th>

              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {shipmentGroups.flatMap(([trackingNumber, shipmentPackages]) =>
              shipmentPackages.map((pkg, index) => (
                <tr
                  key={pkg.packageId}
                  className={
                    pkg.unloaded ? "border-t" : "border-t bg-red-50/40"
                  }
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={pkg.unloaded}
                      onChange={() => togglePackage(pkg.packageId)}
                    />
                  </td>

                  <td className="p-3 font-semibold text-[#0b2340]">
                    {trackingNumber}
                  </td>

                  <td className="p-3">
                    Piece {index + 1} of {shipmentPackages.length}
                  </td>

                  <td className="p-3 text-right font-semibold">
                    {pkg.weight.toFixed(2)} Kg
                  </td>

                  <td className="whitespace-nowrap p-3">
                    {pkg.length} × {pkg.width} × {pkg.height} cm
                  </td>

                  <td className="min-w-[220px] p-3">
                    {!pkg.unloaded ? (
                      <input
                        type="text"
                        value={pkg.remarks}
                        onChange={(e) =>
                          updateRemark(pkg.packageId, e.target.value)
                        }
                        placeholder="Required for missing piece"
                        className="min-h-10 w-full rounded-lg border border-red-200 bg-white px-3 py-2 outline-none focus:border-red-400"
                      />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        pkg.unloaded
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {pkg.unloaded ? "RECEIVED" : "MISSING"}
                    </span>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      {/* ACTION */}
      <div className="flex flex-col gap-4 border-t bg-slate-50 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:flex sm:gap-8">
          <div>
            Total :<strong> {totalPieces}</strong>
          </div>

          <div>
            Unloaded :
            <strong className="text-green-700"> {unloadedPieces}</strong>
          </div>

          <div>
            Missing :
            <strong className="text-red-600"> {notUnloadedPieces}</strong>
          </div>

          <div>
            Weight :<strong> {unloadedWeight.toFixed(2)} Kg</strong>
          </div>
        </div>

        <button
          type="button"
          disabled={saving || totalPieces === 0}
          onClick={completeUnload}
          className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {saving ? "Saving..." : "Complete Unload"}
        </button>
      </div>
    </section>
  );
}
