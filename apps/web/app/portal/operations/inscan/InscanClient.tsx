"use client";

import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

type PackageRow = {
  id?: string;
  length: number;
  width: number;
  height: number;
  weight?: number;
};

export default function InscanClient() {
  const params = useSearchParams();

  const trackingNumber = params.get("tracking");

  const [shipment, setShipment] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [packageCount, setPackageCount] = useState(0);

  const [actualWeight, setActualWeight] = useState(0);

  const [packages, setPackages] = useState<PackageRow[]>([]);

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!trackingNumber) {
      setLoading(false);
      return;
    }

    void loadShipment();
  }, [trackingNumber]);

  async function loadShipment() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/dockets/${encodeURIComponent(trackingNumber!)}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Unable to load shipment.");
        return;
      }

      setShipment(data);

      setPackageCount(Number(data.packageCount ?? 0));

      setActualWeight(Number(data.actualWeight ?? 0));

      setPackages(
        Array.isArray(data.packages)
          ? data.packages.map((pkg: any) => ({
              id: pkg.id,
              length: Number(pkg.length ?? 0),
              width: Number(pkg.width ?? 0),
              height: Number(pkg.height ?? 0),
              weight: Number(pkg.weight ?? 0),
            }))
          : [],
      );

      setRemarks("");
    } catch (error) {
      console.error(error);

      alert("Unable to load shipment.");
    } finally {
      setLoading(false);
    }
  }

  const volumetricWeight = useMemo(() => {
    if (!packages.length) {
      return Number(shipment?.volumetricWeight ?? 0);
    }

    return packages.reduce(
      (total, pkg) =>
        total +
        (Number(pkg.length || 0) *
          Number(pkg.width || 0) *
          Number(pkg.height || 0)) /
          5000,
      0,
    );
  }, [packages, shipment]);

  const chargeableWeight = Math.max(
    Number(actualWeight || 0),
    volumetricWeight,
  );

  const discrepancy = useMemo(() => {
    if (!shipment) {
      return false;
    }

    const packageChanged =
      Number(packageCount) !== Number(shipment.packageCount);

    const weightChanged =
      Math.abs(Number(actualWeight) - Number(shipment.actualWeight)) > 0.001;

    const originalPackages = Array.isArray(shipment.packages)
      ? shipment.packages
      : [];

    const dimensionChanged =
      JSON.stringify(
        packages.map((pkg) => ({
          length: Number(pkg.length || 0),
          width: Number(pkg.width || 0),
          height: Number(pkg.height || 0),
          weight: Number(pkg.weight || 0),
        })),
      ) !==
      JSON.stringify(
        originalPackages.map((pkg: any) => ({
          length: Number(pkg.length || 0),
          width: Number(pkg.width || 0),
          height: Number(pkg.height || 0),
          weight: Number(pkg.weight || 0),
        })),
      );

    return packageChanged || weightChanged || dimensionChanged;
  }, [shipment, packageCount, actualWeight, packages]);

  function updatePackage(
    index: number,
    field: "length" | "width" | "height" | "weight",
    value: string,
  ) {
    setPackages((previous) =>
      previous.map((pkg, pkgIndex) =>
        pkgIndex === index
          ? {
              ...pkg,
              [field]: Number(value),
            }
          : pkg,
      ),
    );
  }

  function addPackageRow() {
    setPackages((previous) => [
      ...previous,
      {
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
      },
    ]);
  }

  function removePackageRow(index: number) {
    setPackages((previous) =>
      previous.filter((_, pkgIndex) => pkgIndex !== index),
    );
  }

  async function inscanShipment() {
    if (!shipment) {
      return;
    }

    if (Number(packageCount) <= 0) {
      alert("Received package count must be greater than zero.");
      return;
    }

    if (Number(actualWeight) <= 0) {
      alert("Actual weight must be greater than zero.");
      return;
    }

    if (discrepancy && !remarks.trim()) {
      alert(
        "Remarks are required because received shipment details differ from booking.",
      );
      return;
    }

    const confirmed = window.confirm(
      discrepancy
        ? "Shipment details differ from booking. Save adjustments and Inscan this shipment?"
        : "Inscan this shipment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/dockets/${encodeURIComponent(shipment.trackingNumber)}/inscan`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            packageCount: Number(packageCount),

            actualWeight: Number(actualWeight),

            packages,

            remarks: remarks.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || "Unable to Inscan shipment.");
        return;
      }

      setShipment(data.shipment);

      alert(
        data.discrepancy
          ? "Shipment adjustments saved and shipment Inscanned."
          : "Shipment Inscanned successfully.",
      );

      /*
       * Refresh so the updated AWB / queue
       * state is immediately visible.
       */
      window.location.replace("/portal/operations/search-docket");
    } catch (error) {
      console.error(error);

      alert("Unable to Inscan shipment.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-4 sm:p-8">Loading Shipment...</div>;
  }

  if (!trackingNumber || !shipment) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-500">
        Shipment not found.
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* PAGE HEADER */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ff7417]">
          Origin Operations
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">
          Shipment Inscan
        </h1>

        <p className="mt-2 text-slate-500">
          Verify the physical shipment before receiving it into the origin
          branch warehouse.
        </p>
      </div>

      {/* SHIPMENT DETAILS */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[#0b2340] sm:text-xl">
          Shipment Details
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3">
          <Info label="AWB Number" value={shipment.trackingNumber} />

          <Info label="Sender" value={shipment.senderName} />

          <Info label="Receiver" value={shipment.receiverName} />

          <Info label="Origin" value={shipment.origin} />

          <Info label="Destination" value={shipment.destination} />

          <Info label="Current Status" value={shipment.status} strong />
        </div>
      </section>

      {/* BOOKED VS RECEIVED */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0b2340] sm:text-xl">
              Physical Verification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Compare the booked values with what has physically arrived.
            </p>
          </div>

          {discrepancy && (
            <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#ff7417]">
              Discrepancy Detected
            </span>
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border">
          <div className="grid grid-cols-3 bg-slate-50 text-sm font-semibold text-slate-600">
            <div className="p-3 sm:p-4">Field</div>

            <div className="p-3 sm:p-4">Booked</div>

            <div className="p-3 sm:p-4">Received</div>
          </div>

          <VerificationRow label="Packages" booked={shipment.packageCount}>
            <input
              type="number"
              min={1}
              value={packageCount}
              onChange={(event) => setPackageCount(Number(event.target.value))}
              className="min-h-10 w-full rounded-lg border p-2.5"
            />
          </VerificationRow>

          <VerificationRow
            label="Actual Weight"
            booked={`${Number(shipment.actualWeight ?? 0).toFixed(2)} Kg`}
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step="0.01"
                value={actualWeight}
                onChange={(event) =>
                  setActualWeight(Number(event.target.value))
                }
                className="min-h-10 min-w-0 flex-1 rounded-lg border p-2.5"
              />

              <span className="shrink-0 text-sm text-slate-500">Kg</span>
            </div>
          </VerificationRow>

          <VerificationRow
            label="Volumetric Weight"
            booked={`${Number(shipment.volumetricWeight ?? 0).toFixed(2)} Kg`}
          >
            <div className="font-semibold text-slate-700">
              {volumetricWeight.toFixed(2)} Kg
            </div>
          </VerificationRow>

          <VerificationRow
            label="Chargeable Weight"
            booked={`${Number(shipment.chargeableWeight ?? 0).toFixed(2)} Kg`}
          >
            <div className="font-bold text-[#0b2340]">
              {chargeableWeight.toFixed(2)} Kg
            </div>
          </VerificationRow>
        </div>
      </section>

      {/* PACKAGE DIMENSIONS */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0b2340] sm:text-xl">
              Package Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Verify or correct package dimensions and package weight.
            </p>
          </div>

          <button
            type="button"
            onClick={addPackageRow}
            className="min-h-11 w-full rounded-lg border border-[#1877F2] px-4 py-2.5 font-semibold text-[#1877F2] sm:w-auto"
          >
            + Add Package
          </button>
        </div>

        {!packages.length ? (
          <div className="mt-5 rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
            No package dimension rows were recorded during booking.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {packages.map((pkg, index) => (
              <div key={pkg.id ?? index} className="rounded-xl border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-bold text-[#0b2340]">
                    Package {index + 1}
                  </div>

                  <button
                    type="button"
                    onClick={() => removePackageRow(index)}
                    className="text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <PackageInput
                    label="Length (cm)"
                    value={pkg.length}
                    onChange={(value) => updatePackage(index, "length", value)}
                  />

                  <PackageInput
                    label="Width (cm)"
                    value={pkg.width}
                    onChange={(value) => updatePackage(index, "width", value)}
                  />

                  <PackageInput
                    label="Height (cm)"
                    value={pkg.height}
                    onChange={(value) => updatePackage(index, "height", value)}
                  />

                  <PackageInput
                    label="Weight (kg)"
                    value={pkg.weight ?? 0}
                    onChange={(value) => updatePackage(index, "weight", value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* REMARKS */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <label className="font-bold text-[#0b2340]">
          Remarks
          {discrepancy && <span className="ml-1 text-red-600">*</span>}
        </label>

        <p className="mt-1 text-sm text-slate-500">
          {discrepancy
            ? "Explain the difference between booked and physically received shipment details."
            : "Optional when the shipment matches the booking."}
        </p>

        <textarea
          rows={4}
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder={
            discrepancy
              ? "Example: 10 packages booked, only 6 packages physically received at BLR warehouse."
              : "Add warehouse remarks if required."
          }
          className="mt-4 w-full rounded-xl border p-3 text-base"
        />
      </section>

      {/* ACTION */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => history.back()}
          className="min-h-11 w-full rounded-lg border px-6 py-3 font-semibold sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={inscanShipment}
          className="min-h-11 w-full rounded-lg bg-[#1877F2] px-7 py-3 font-bold text-white disabled:opacity-50 sm:w-auto"
        >
          {saving
            ? "Updating..."
            : discrepancy
              ? "Save & Inscan Shipment"
              : "Inscan Shipment"}
        </button>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: any;
  strong?: boolean;
}) {
  return (
    <div>
      <div className="text-sm text-slate-500">{label}</div>

      <div
        className={
          strong
            ? "mt-1 font-bold text-[#1877F2]"
            : "mt-1 font-semibold text-slate-900"
        }
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

function VerificationRow({
  label,
  booked,
  children,
}: {
  label: string;
  booked: any;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 items-center border-t text-sm">
      <div className="p-3 font-medium text-slate-600 sm:p-4">{label}</div>

      <div className="p-3 font-semibold text-slate-700 sm:p-4">{booked}</div>

      <div className="min-w-0 p-3 sm:p-4">{children}</div>
    </div>
  );
}

function PackageInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </span>

      <input
        type="number"
        min={0}
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border p-2.5"
      />
    </label>
  );
}
