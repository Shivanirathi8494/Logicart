"use client";

export default function LoadingTallyGroups({
  loadingTally,
}: any) {
  const validShipments = (loadingTally?.shipments ?? [])
    .map((item: any) => item?.shipment)
    .filter((shipment: any) => shipment);

  const groups = Object.values(
    validShipments.reduce(
      (acc: any, shipment: any) => {
        const key =
          shipment.origin +
          "|" +
          shipment.destination;

        if (!acc[key]) {
          acc[key] = {
            origin: shipment.origin,
            destination: shipment.destination,
            shipments: [],
          };
        }

        acc[key].shipments.push(shipment);

        return acc;
      },
      {}
    )
  );

  async function generateManifest(group: any) {
    try {
      const trackingNumbers = group.shipments
        .map((shipment: any) => shipment.trackingNumber)
        .filter(Boolean);

      if (!trackingNumbers.length) {
        alert("No valid AWBs available for this manifest.");
        return;
      }

      const response = await fetch(
        "/api/manifests/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loadingTallyId: loadingTally.id,
            loadingTallyNumber:
              loadingTally.loadingTallyNumber,
            origin: group.origin,
            destination: group.destination,
            trackingNumbers,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 409) {
        if (data?.manifestNumber) {
          window.open(
            "/portal/manifest/preview?manifest=" +
              encodeURIComponent(data.manifestNumber),
            "_blank"
          );
        } else {
          alert(
            data?.error ||
              "Manifest already exists."
          );
        }

        return;
      }

      if (!response.ok) {
        console.error(
          "Manifest generation failed:",
          data
        );

        alert(
          data?.error ||
            "Unable to generate Manifest."
        );

        return;
      }

      if (!data?.manifestNumber) {
        alert(
          "Manifest was generated but no manifest number was returned."
        );
        return;
      }

      window.open(
        "/portal/manifest/preview?manifest=" +
          encodeURIComponent(data.manifestNumber),
        "_blank"
      );
    } catch (error) {
      console.error(
        "Manifest generation error:",
        error
      );

      alert("Unable to generate Manifest.");
    }
  }

  if (!groups.length) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
        No valid shipments available for manifest generation.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group: any, index: number) => {
        const pieces = group.shipments.reduce(
          (total: number, shipment: any) =>
            total +
            Number(shipment.packageCount || 0),
          0
        );

        const weight = group.shipments.reduce(
          (total: number, shipment: any) =>
            total +
            Number(
              shipment.chargeableWeight || 0
            ),
          0
        );

        return (
          <section
            key={index}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold">
                  {group.origin} →{" "}
                  {group.destination}
                </h2>

                <div className="mt-2 text-slate-500">
                  Shipments :{" "}
                  {group.shipments.length}
                </div>

                <div className="text-slate-500">
                  Pieces : {pieces}
                </div>

                <div className="text-slate-500">
                  Weight : {weight} Kg
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  generateManifest(group)
                }
                className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
              >
                Generate Manifest
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
