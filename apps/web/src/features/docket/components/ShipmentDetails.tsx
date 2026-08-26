"use client";

import { useEffect } from "react";
import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<React.SetStateAction<CreateShipmentRequest>>;
};

export default function ShipmentDetails({ shipment, setShipment }: Props) {
  useEffect(() => {
    const volumetric = shipment.packages.reduce((sum, pkg) => {
      if (pkg.length <= 0 || pkg.width <= 0 || pkg.height <= 0) {
        return sum;
      }

      return sum + (pkg.length * pkg.width * pkg.height) / 6000;
    }, 0);

    const actual = shipment.packages.reduce(
      (sum, pkg) => sum + Math.max(0, Number(pkg.weight) || 0),
      0,
    );

    const chargeable = Math.max(actual, volumetric);

    const volumetricWeight = Number(volumetric.toFixed(2));

    const chargeableWeight = Number(chargeable.toFixed(2));

    setShipment((prev) => {
      if (
        prev.actualWeight === actual &&
        prev.volumetricWeight === volumetricWeight &&
        prev.chargeableWeight === chargeableWeight
      ) {
        return prev;
      }

      return {
        ...prev,
        actualWeight: Number(actual.toFixed(2)),
        volumetricWeight,
        chargeableWeight,
      };
    });
  }, [shipment.actualWeight, shipment.packages, setShipment]);

  useEffect(() => {
    async function calculateFreight() {
      if (
        !shipment.airlineId ||
        !shipment.origin ||
        !shipment.destination ||
        shipment.chargeableWeight <= 0
      ) {
        setShipment((prev) => ({
          ...prev,
          freight: 0,
          gst: 0,
          total: 0,
        }));
        return;
      }

      try {
        const params = new URLSearchParams({
          airlineId: shipment.airlineId,
          origin: shipment.origin,
          destination: shipment.destination,
          chargeableWeight: String(shipment.chargeableWeight),
        });

        const response = await fetch(
          `/api/tariffs/calculate?${params.toString()}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setShipment((prev) => ({
            ...prev,
            freight: 0,
            gst: 0,
            total: 0,
            tariffError:
              data.error || "Tariff is not configured for this route.",
          }));

          return;
        }

        const freight = Number(data.freight);
        const gst = Number((freight * 0.18).toFixed(2));
        const total = Number((freight + gst).toFixed(2));

        setShipment((prev) => ({
          ...prev,
          freight,
          gst,
          total,
          tariffError: "",
        }));
      } catch (error) {
        console.error("Unable to calculate freight:", error);
      }
    }

    calculateFreight();
  }, [
    shipment.airlineId,
    shipment.origin,
    shipment.destination,
    shipment.chargeableWeight,
    setShipment,
  ]);

  function updatePackage(
    index: number,
    field: "length" | "width" | "height" | "weight",
    value: number,
  ) {
    const copy = [...shipment.packages];

    copy[index][field] = value;

    setShipment((prev) => ({
      ...prev,
      packages: copy,
    }));
  }

  function updatePackageCount(count: number) {
    const packages = [...shipment.packages];

    while (packages.length < count) {
      packages.push({
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
      });
    }

    setShipment((prev) => ({
      ...prev,
      packageCount: count,
      packages: packages.slice(0, count),
    }));
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#0b2340] sm:mb-6 sm:text-xl">
        Shipment Details
      </h2>

      <div className="mb-5 sm:mb-8">
        <label className="mb-2 block font-medium">Number of Packages</label>

        <input
          type="number"
          min="1"
          className="min-h-11 w-full rounded-lg border p-3 text-base sm:w-40"
          value={shipment.packageCount}
          onChange={(e) => updatePackageCount(Number(e.target.value))}
        />
      </div>

      <div className="space-y-4 sm:space-y-6">
        {shipment.packages.map((pkg, index) => (
          <div key={index} className="rounded-lg border p-4 sm:p-5">
            <h3 className="mb-4 font-semibold">Package {index + 1}</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <input
                type="number"
                placeholder="Length (cm)"
                className="min-h-11 w-full rounded-lg border p-3 text-base"
                value={pkg.length || ""}
                onChange={(e) =>
                  updatePackage(index, "length", Number(e.target.value))
                }
              />

              <input
                type="number"
                placeholder="Width (cm)"
                className="min-h-11 w-full rounded-lg border p-3 text-base"
                value={pkg.width || ""}
                onChange={(e) =>
                  updatePackage(index, "width", Number(e.target.value))
                }
              />

              <input
                type="number"
                placeholder="Height (cm)"
                className="min-h-11 w-full rounded-lg border p-3 text-base"
                value={pkg.height || ""}
                onChange={(e) =>
                  updatePackage(index, "height", Number(e.target.value))
                }
              />

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Weight (kg)"
                className="min-h-11 w-full rounded-lg border p-3 text-base"
                value={pkg.weight || ""}
                onChange={(e) =>
                  updatePackage(index, "weight", Number(e.target.value))
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
        <input
          type="number"
          readOnly
          placeholder="Actual Weight (kg)"
          value={shipment.actualWeight || ""}
          className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
        />

        <input
          readOnly
          className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
          placeholder="Volumetric Weight (kg)"
          value={shipment.volumetricWeight}
        />

        <input
          readOnly
          className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
          placeholder="Chargeable Weight (kg)"
          value={shipment.chargeableWeight}
        />
      </div>

      <textarea
        rows={4}
        className="mt-5 w-full rounded-lg border p-3 text-base sm:mt-6"
        placeholder="Contents"
        value={shipment.contents}
        onChange={(e) =>
          setShipment((prev) => ({
            ...prev,
            contents: e.target.value,
          }))
        }
      />
    </section>
  );
}
