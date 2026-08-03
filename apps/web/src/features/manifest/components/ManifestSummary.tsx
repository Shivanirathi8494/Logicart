"use client";

type Props = {
  shipments: any[];
  onCreated: (manifestNumber: string) => void;
};

export default function ManifestSummary({
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
        origin: shipments[0].origin,
        destination: shipments[0].destination,
        flightNumber: "AI603",
        vehicleNumber: "VT-123",
        remarks: "",
        shipments: shipments.map((s: any) => s.id),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Unable to create manifest");
      return;
    }

    onCreated(data.manifestNumber);
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="grid gap-6 md:grid-cols-3">

        <div>
          <div className="text-sm text-slate-500">
            Total Shipments
          </div>
          <div className="text-3xl font-bold">
            {totalShipment}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-500">
            Total Pieces
          </div>
          <div className="text-3xl font-bold">
            {totalPieces}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-500">
            Total Weight
          </div>
          <div className="text-3xl font-bold">
            {totalWeight.toFixed(2)} Kg
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end gap-4">

        <button
          className="rounded-lg border px-6 py-3"
        >
          Preview Manifest
        </button>

        <button
          onClick={generateManifest}
          className="rounded-lg bg-[#1877F2] px-6 py-3 text-white"
        >
          Generate Manifest
        </button>

      </div>

    </section>
  );
}
