"use client";

import { useEffect } from "react";
import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<React.SetStateAction<CreateShipmentRequest>>;
  clientPricing?: boolean;
};

type PackageField = "quantity" | "length" | "width" | "height" | "weight";

export default function ShipmentDetails({
  shipment,
  setShipment,
  clientPricing = false,
}: Props) {
  useEffect(() => {
    const totalPackages = shipment.packages.reduce(
      (sum, pkg) => sum + Math.max(1, Number(pkg.quantity) || 1),
      0,
    );

    const actual = shipment.packages.reduce((sum, pkg) => {
      const quantity = Math.max(1, Number(pkg.quantity) || 1);
      const weight = Math.max(0, Number(pkg.weight) || 0);

      return sum + weight * quantity;
    }, 0);

    const volumetric = shipment.packages.reduce((sum, pkg) => {
      if (pkg.length <= 0 || pkg.width <= 0 || pkg.height <= 0) {
        return sum;
      }

      const quantity = Math.max(1, Number(pkg.quantity) || 1);

      return (
        sum +
        ((pkg.length * pkg.width * pkg.height) / 6000) * quantity
      );
    }, 0);

    const actualWeight = Number(actual.toFixed(2));
    const volumetricWeight = Number(volumetric.toFixed(2));
    const chargeableWeight = Number(
      Math.max(actualWeight, volumetricWeight).toFixed(2),
    );

    setShipment((prev) => {
      if (
        prev.packageCount === totalPackages &&
        prev.actualWeight === actualWeight &&
        prev.volumetricWeight === volumetricWeight &&
        prev.chargeableWeight === chargeableWeight
      ) {
        return prev;
      }

      return {
        ...prev,
        packageCount: totalPackages,
        actualWeight,
        volumetricWeight,
        chargeableWeight,
      };
    });
  }, [shipment.packages, setShipment]);

  useEffect(() => {
    async function calculateFreight() {
      if (clientPricing) {
        return;
      }

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
    clientPricing,
  ]);

  function updatePackage(
    index: number,
    field: PackageField,
    value: number,
  ) {
    setShipment((prev) => {
      const packages = prev.packages.map((pkg, packageIndex) =>
        packageIndex === index
          ? {
              ...pkg,
              [field]:
                field === "quantity"
                  ? Math.max(1, Math.floor(value || 1))
                  : value,
            }
          : pkg,
      );

      return {
        ...prev,
        packages,
      };
    });
  }

  function addPackageType() {
    setShipment((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          quantity: 1,
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
        },
      ],
    }));
  }

  function duplicatePackage(index: number) {
    setShipment((prev) => {
      const source = prev.packages[index];

      if (!source) {
        return prev;
      }

      const duplicate = {
        ...source,
        quantity: source.quantity ?? 1,
      };

      const packages = [...prev.packages];

      packages.splice(index + 1, 0, duplicate);

      return {
        ...prev,
        packages,
      };
    });
  }

  function removePackage(index: number) {
    setShipment((prev) => {
      if (prev.packages.length <= 1) {
        return {
          ...prev,
          packages: [
            {
              quantity: 1,
              length: 0,
              width: 0,
              height: 0,
              weight: 0,
            },
          ],
        };
      }

      return {
        ...prev,
        packages: prev.packages.filter(
          (_, packageIndex) => packageIndex !== index,
        ),
      };
    });
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#0b2340] sm:text-xl">
          Shipment Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add one package type for packages having the same dimensions and
          weight.
        </p>
      </div>

      <div className="mb-6">
        <label className="mb-3 block font-semibold text-[#0b2340]">
          Delivery Mode
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setShipment((prev) => ({
                ...prev,
                deliveryType: "DOOR_TO_DOOR",
              }))
            }
            className={`rounded-xl border p-4 text-left transition ${
              shipment.deliveryType === "DOOR_TO_DOOR"
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className="font-semibold text-[#0b2340]">
              Door to Door
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Shipment will be delivered to the consignee address.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setShipment((prev) => ({
                ...prev,
                deliveryType: "AIRPORT_DELIVERY",
              }))
            }
            className={`rounded-xl border p-4 text-left transition ${
              shipment.deliveryType === "AIRPORT_DELIVERY"
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className="font-semibold text-[#0b2340]">
              Airport / Warehouse Delivery
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Shipment will be collected from the destination airport or branch.
            </div>
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-slate-700">
        <span className="font-semibold text-[#0b2340]">Tip: </span>
        If multiple packages have the same size and weight, enter their
        quantity in one row. Use Duplicate or Add Package Type when the next
        packages are different.
      </div>

      <div className="space-y-4">
        {shipment.packages.map((pkg, index) => {
          const quantity = Math.max(1, Number(pkg.quantity) || 1);

          return (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-[#0b2340]">
                    Package Type {index + 1}
                  </h3>

                  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                    {quantity} {quantity === 1 ? "package" : "packages"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => duplicatePackage(index)}
                    className="font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Duplicate
                  </button>

                  <button
                    type="button"
                    onClick={() => removePackage(index)}
                    className="font-medium text-red-500 transition hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="min-h-11 w-full rounded-lg border p-3 text-base"
                    value={quantity}
                    onChange={(e) =>
                      updatePackage(
                        index,
                        "quantity",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Length (cm)
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Length"
                    className="min-h-11 w-full rounded-lg border p-3 text-base"
                    value={pkg.length || ""}
                    onChange={(e) =>
                      updatePackage(
                        index,
                        "length",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Width (cm)
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Width"
                    className="min-h-11 w-full rounded-lg border p-3 text-base"
                    value={pkg.width || ""}
                    onChange={(e) =>
                      updatePackage(
                        index,
                        "width",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Height (cm)
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Height"
                    className="min-h-11 w-full rounded-lg border p-3 text-base"
                    value={pkg.height || ""}
                    onChange={(e) =>
                      updatePackage(
                        index,
                        "height",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Weight / Package (kg)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Weight"
                    className="min-h-11 w-full rounded-lg border p-3 text-base"
                    value={pkg.weight || ""}
                    onChange={(e) =>
                      updatePackage(
                        index,
                        "weight",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addPackageType}
        className="mt-5 flex min-h-14 w-full items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/40 font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        + Add Package Type
      </button>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-[#0b2340]">
            Shipment Summary
          </h3>

          <span className="text-sm text-slate-500">
            Auto Calculated
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div>
            <div className="text-sm text-slate-500">Total Packages</div>
            <div className="mt-1 text-xl font-semibold text-[#0b2340]">
              {shipment.packageCount}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">Actual Weight</div>
            <div className="mt-1 text-xl font-semibold text-[#0b2340]">
              {shipment.actualWeight.toFixed(2)} kg
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">
              Volumetric Weight
            </div>
            <div className="mt-1 text-xl font-semibold text-[#0b2340]">
              {shipment.volumetricWeight.toFixed(2)} kg
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">
              Chargeable Weight
            </div>
            <div className="mt-1 text-xl font-semibold text-[#0b2340]">
              {shipment.chargeableWeight.toFixed(2)} kg
            </div>
          </div>
        </div>
      </div>

      <textarea
        rows={4}
        className="mt-5 w-full rounded-lg border p-3 text-base"
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
