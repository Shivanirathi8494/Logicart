"use client";

import { useEffect } from "react";
import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

export default function ShipmentDetails({
  shipment,
  setShipment,
}: Props) {

  useEffect(() => {

    const volumetric = shipment.packages.reduce((sum, pkg) => {
      return sum + (pkg.length * pkg.width * pkg.height) / 5000;
    }, 0);

    const chargeable = Math.max(
      shipment.actualWeight,
      volumetric
    );

    const freight = chargeable * 200;

    const gst = Number((freight * 0.18).toFixed(2));

    const total = freight + gst;

    setShipment((prev) => ({
      ...prev,
      volumetricWeight: Number(volumetric.toFixed(2)),
      chargeableWeight: Number(chargeable.toFixed(2)),
      freight,
      gst,
      total,
    }));

  }, [
    shipment.actualWeight,
    shipment.packages,
    setShipment,
  ]);

  function updatePackage(
    index: number,
    field: "length" | "width" | "height",
    value: number
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
      });
    }

    setShipment((prev) => ({
      ...prev,
      packageCount: count,
      packages: packages.slice(0, count),
    }));

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
          value={shipment.packageCount}
          onChange={(e)=>
            updatePackageCount(Number(e.target.value))
          }
        />

      </div>

      <div className="space-y-6">

        {shipment.packages.map((pkg,index)=>(

          <div
            key={index}
            className="rounded-lg border p-5"
          >

            <h3 className="mb-4 font-semibold">
              Package {index+1}
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <input
                type="number"
                placeholder="Length"
                className="rounded-lg border p-3"
                value={pkg.length || ""}
                onChange={(e)=>
                  updatePackage(
                    index,
                    "length",
                    Number(e.target.value)
                  )
                }
              />

              <input
                type="number"
                placeholder="Width"
                className="rounded-lg border p-3"
                value={pkg.width || ""}
                onChange={(e)=>
                  updatePackage(
                    index,
                    "width",
                    Number(e.target.value)
                  )
                }
              />

              <input
                type="number"
                placeholder="Height"
                className="rounded-lg border p-3"
                value={pkg.height || ""}
                onChange={(e)=>
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
          className="rounded-lg border p-3"
          placeholder="Actual Weight"
          value={shipment.actualWeight || ""}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              actualWeight:Number(e.target.value),
            }))
          }
        />

        <input
          readOnly
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.volumetricWeight}
        />

        <input
          readOnly
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.chargeableWeight}
        />

      </div>

      <textarea
        rows={4}
        className="mt-6 w-full rounded-lg border p-3"
        placeholder="Contents"
        value={shipment.contents}
        onChange={(e)=>
          setShipment(prev=>({
            ...prev,
            contents:e.target.value,
          }))
        }
      />

    </section>

  );

}
