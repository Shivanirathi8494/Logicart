"use client";

type Props = {
  manifest: any;
  shipments: any[];
  onCreated: (manifestNumber: string) => void;
};

export default function ManifestSummary({
  manifest,
  shipments,
  onCreated,
}: Props) {

  const totalShipment = shipments.length;

  const totalPieces = shipments.reduce(
    (sum, s) => sum + s.packageCount,
    0
  );

  const totalWeight = shipments.reduce(
    (sum, s) => sum + s.chargeableWeight,
    0
  );

  async function generateManifest() {

    if (!manifest.origin) {
      alert("Please select Origin.");
      return;
    }

    if (!manifest.destination) {
      alert("Please select Destination.");
      return;
    }

    if (manifest.origin === manifest.destination) {
      alert("Origin and Destination cannot be the same.");
      return;
    }

    if (!shipments.length) {
      alert("Please add at least one shipment.");
      return;
    }

    const response = await fetch("/api/manifests", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        manifestDate: manifest.manifestDate,

        origin: manifest.origin,

        destination: manifest.destination,

        flightNumber: manifest.flightNumber,

        vehicleNumber: manifest.vehicleNumber,

        remarks: manifest.remarks,

        shipments: shipments.map(
          (s: any) => s.trackingNumber
        ),

      }),

    });

    const data = await response.json();

    if (!response.ok) {

      alert(
        data.error ??
        "Unable to create Manifest."
      );

      return;

    }

    onCreated(data.manifestNumber);

  }

  return (

    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">

        <div>

          <div className="text-sm text-slate-500">
            Total Shipments
          </div>

          <div className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">
            {totalShipment}
          </div>

        </div>

        <div>

          <div className="text-sm text-slate-500">
            Total Pieces
          </div>

          <div className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">
            {totalPieces}
          </div>

        </div>

        <div>

          <div className="text-sm text-slate-500">
            Total Weight
          </div>

          <div className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">
            {totalWeight.toFixed(2)} Kg
          </div>

        </div>

      </div>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-end sm:gap-4">

        <button
          className="min-h-11 w-full rounded-lg border px-6 py-3 font-semibold sm:w-auto"
        >
          Preview Manifest
        </button>

        <button
          onClick={generateManifest}
          className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white sm:w-auto"
        >
          Generate Manifest
        </button>

      </div>

    </section>

  );

}
