"use client";

import StationSelect from "@/components/master/StationSelect";

type Props = {
  manifest: any;
  setManifest: React.Dispatch<React.SetStateAction<any>>;
};

export default function ManifestInformation({
  manifest,
  setManifest,
}: Props) {

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Manifest Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Manifest Number
          </label>

          <input
            readOnly
            value={manifest.manifestNumber}
            className="w-full rounded-lg border bg-slate-100 p-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Manifest Date
          </label>

          <input
            type="date"
            value={manifest.manifestDate}
            className="w-full rounded-lg border p-3"
            onChange={(e)=>
              setManifest((prev: any)=>({
                ...prev,
                manifestDate:e.target.value,
              }))
            }
          />

        </div>

        <StationSelect
          label="Origin"
          value={manifest.origin}
          onChange={(value)=>
            setManifest((prev: any)=>({
              ...prev,
              origin:value,
            }))
          }
        />

        <StationSelect
          label="Destination"
          value={manifest.destination}
          onChange={(value)=>
            setManifest((prev: any)=>({
              ...prev,
              destination:value,
            }))
          }
        />

        <div>

          <label className="mb-2 block text-sm font-medium">
            Flight Number
          </label>

          <input
            value={manifest.flightNumber}
            className="w-full rounded-lg border p-3"
            onChange={(e)=>
              setManifest((prev: any)=>({
                ...prev,
                flightNumber:e.target.value.toUpperCase(),
              }))
            }
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Vehicle Number
          </label>

          <input
            value={manifest.vehicleNumber}
            className="w-full rounded-lg border p-3 uppercase"
            onChange={(e)=>
              setManifest((prev: any)=>({
                ...prev,
                vehicleNumber:e.target.value.toUpperCase(),
              }))
            }
          />

        </div>

      </div>

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium">
          Remarks
        </label>

        <textarea
          rows={3}
          className="w-full rounded-lg border p-3"
          value={manifest.remarks}
          onChange={(e)=>
            setManifest((prev: any)=>({
              ...prev,
              remarks:e.target.value,
            }))
          }
        />

      </div>

    </section>

  );

}
