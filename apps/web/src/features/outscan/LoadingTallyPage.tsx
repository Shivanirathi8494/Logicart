"use client";

import { useEffect, useState } from "react";

export default function LoadingTallyPage({
  loadingTallyNumber,
}: {
  loadingTallyNumber: string;
}) {
  const [tally, setTally] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const response = await fetch(
      "/api/loading-tallies/" + loadingTallyNumber
    );

    setTally(await response.json());
  }

  if (!tally) {
    return <div className="p-8">Loading...</div>;
  }

  const groups = Object.values(
    tally.shipments.reduce((acc: any, item: any) => {
      const key =
        item.shipment.origin +
        "->" +
        item.shipment.destination;

      if (!acc[key]) {
        acc[key] = {
          origin: item.shipment.origin,
          destination: item.shipment.destination,
          shipments: [],
        };
      }

      acc[key].shipments.push(item.shipment);

      return acc;
    }, {})
  );

  async function generateManifest(group: any) {
    try {
      const trackingNumbers = group.shipments
        .map((shipment: any) => shipment.trackingNumber)
        .filter(Boolean);

      if (!trackingNumbers.length) {
        alert("No shipments available for manifest.");
        return;
      }

      const response = await fetch("/api/manifests/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: group.origin,
          destination: group.destination,
          trackingNumbers,
          loadingTallyId: tally.id,
          loadingTallyNumber: tally.loadingTallyNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Manifest generation failed:", data);
        alert(data.error || "Unable to generate manifest.");
        return;
      }

      window.open(
        "/portal/manifest/preview?manifest=" +
          encodeURIComponent(data.manifestNumber),
        "_blank",
      );
    } catch (error) {
      console.error("Manifest generation failed:", error);
      alert("Unable to generate manifest.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        {tally.loadingTallyNumber}
      </h1>

      <div className="mt-6 space-y-6">
        {groups.map((group: any, index: number) => (
          <section
            key={index}
            className="rounded-xl border bg-white p-6"
          >
            <h2 className="text-xl font-bold">
              {group.origin} → {group.destination}
            </h2>

            <div className="mt-2 text-slate-500">
              Shipments : {group.shipments.length}
            </div>

            <button
              onClick={() => generateManifest(group)}
              className="mt-4 rounded-lg bg-green-600 px-6 py-3 text-white"
            >
              Generate Manifest
            </button>

            <table className="mt-6 w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2 text-left">
                    AWB Number
                  </th>
                  <th className="border p-2 text-center">
                    Pieces
                  </th>
                </tr>
              </thead>

              <tbody>
                {group.shipments.map(
                  (shipment: any, shipmentIndex: number) => (
                    <tr key={shipment.id ?? shipmentIndex}>
                      <td className="border p-2">
                        {shipment.trackingNumber}
                      </td>

                      <td className="border p-2 text-center">
                        {shipment.packageCount}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </div>
  );
}
