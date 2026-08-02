"use client";

import { useEffect, useState } from "react";

type Package = {
  length: number;
  width: number;
  height: number;
};

export default function ShipmentDetails() {
  const [packageCount, setPackageCount] = useState(1);

  const [packages, setPackages] = useState<Package>([
    {
      length: 0,
      width: 0,
      height: 0,
    },
  ] as any);

  const [actualWeight, setActualWeight] = useState("");

  const [volumetricWeight, setVolumetricWeight] = useState(0);

  const [chargeableWeight, setChargeableWeight] = useState(0);

  const [contents, setContents] = useState("");

  useEffect(() => {
    setPackages((prev) => {
      const next = [...prev];

      while (next.length < packageCount) {
        next.push({
          length: 0,
          width: 0,
          height: 0,
        });
      }

      return next.slice(0, packageCount);
    });
  }, [packageCount]);

  useEffect(() => {
    const volume = packages.reduce((sum, p) => {
      return sum + (p.length * p.width * p.height) / 5000;
    }, 0);

    setVolumetricWeight(Number(volume.toFixed(2)));

    const actual = Number(actualWeight) || 0;

    setChargeableWeight(
      Math.max(actual, volume)
    );
  }, [packages, actualWeight]);

  function updatePackage(
    index: number,
    field: keyof Package,
    value: number
  ) {
    const copy = [...packages];

    copy[index][field] = value;

    setPackages(copy);
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Shipment Details
      </h2>

      <div className="mb-8">

        <label className="mb-2 block font-medium">
          Number of Packages
        </label>

        <input
          type="number"
          min="1"
          className="w-40 rounded-lg border p-3"
          value={packageCount}
          onChange={(e) =>
            setPackageCount(Number(e.target.value))
          }
        />

      </div>

      <div className="space-y-6">

        {packages.map((pkg, index) => (

          <div
            key={index}
            className="rounded-lg border p-5"
          >

            <h3 className="mb-4 font-semibold">
              Package {index + 1}
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <input
                type="number"
                placeholder="Length (cm)"
                className="rounded-lg border p-3"
                value={pkg.length || ""}
                onChange={(e) =>
                  updatePackage(
                    index,
                    "length",
                    Number(e.target.value)
                  )
                }
              />

              <input
                type="number"
                placeholder="Width (cm)"
                className="rounded-lg border p-3"
                value={pkg.width || ""}
                onChange={(e) =>
                  updatePackage(
                    index,
                    "width",
                    Number(e.target.value)
                  )
                }
              />

              <input
                type="number"
                placeholder="Height (cm)"
                className="rounded-lg border p-3"
                value={pkg.height || ""}
                onChange={(e) =>
                  updatePackage(
                    index,
                    "height",
                    Number(e.target.value)
                  )
                }
              />

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <input
          type="number"
          placeholder="Actual Weight (Kg)"
          className="rounded-lg border p-3"
          value={actualWeight}
          onChange={(e) =>
            setActualWeight(e.target.value)
          }
        />

        <input
          readOnly
          className="rounded-lg border bg-slate-100 p-3"
          value={volumetricWeight}
          placeholder="Volumetric Weight"
        />

        <input
          readOnly
          className="rounded-lg border bg-slate-100 p-3"
          value={chargeableWeight}
          placeholder="Chargeable Weight"
        />

      </div>

      <textarea
        rows={4}
        className="mt-6 w-full rounded-lg border p-3"
        placeholder="Contents Description"
        value={contents}
        onChange={(e) =>
          setContents(e.target.value)
        }
      />

    </section>
  );
}
