"use client";

import { useState } from "react";

export default function LoadingTallySummary({
  shipments,
}: any) {
  const [loading, setLoading] = useState(false);

  const totalPieces = shipments.reduce(
    (total: number, shipment: any) =>
      total + Number(shipment.packageCount || 0),
    0
  );

  const totalWeight = shipments.reduce(
    (total: number, shipment: any) =>
      total + Number(shipment.chargeableWeight || 0),
    0
  );

  async function saveAndGenerate() {
    if (!shipments.length) {
      alert("Please add at least one BOOKED AWB.");
      return;
    }

    const origin = shipments[0]?.origin;
    const destination = shipments[0]?.destination;

    const mixedRoute = shipments.some(
      (shipment: any) =>
        shipment.origin !== origin ||
        shipment.destination !== destination
    );

    if (mixedRoute) {
      alert(
        "All AWBs must have the same Origin and Destination."
      );
      return;
    }

    setLoading(true);

    try {
      // ---------------------------------------------
      // STEP 1: SAVE LOADING TALLY
      // ---------------------------------------------

      const loadingTallyNumber = "LT-" + Date.now();

      const tallyResponse = await fetch(
        "/api/loading-tallies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loadingTallyNumber,
            loadingDate: new Date(),
            shipmentIds: shipments.map(
              (shipment: any) => shipment.id
            ),
          }),
        }
      );

      const tallyData = await tallyResponse.json();

      if (!tallyResponse.ok) {
        console.error(
          "Loading Tally error:",
          tallyData
        );

        alert(
          tallyData?.error ||
            "Unable to save Loading Tally."
        );

        return;
      }

      if (!tallyData?.id) {
        console.error(
          "Loading Tally response:",
          tallyData
        );

        alert(
          "Loading Tally was created but its ID was not returned."
        );

        return;
      }

      // ---------------------------------------------
      // STEP 2: GENERATE MANIFEST
      // ---------------------------------------------

      const trackingNumbers = shipments
        .map(
          (shipment: any) =>
            shipment.trackingNumber
        )
        .filter(Boolean);

      const manifestResponse = await fetch(
        "/api/manifests/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loadingTallyId: tallyData.id,
            loadingTallyNumber:
              tallyData.loadingTallyNumber,

            origin,
            destination,

            trackingNumbers,
          }),
        }
      );

      const manifestData =
        await manifestResponse.json();

      if (!manifestResponse.ok) {
        console.error(
          "Manifest generation error:",
          manifestData
        );

        if (
          manifestResponse.status === 409 &&
          manifestData?.manifestNumber
        ) {
          window.location.href =
            "/portal/manifest/preview?manifest=" +
            encodeURIComponent(
              manifestData.manifestNumber
            );

          return;
        }

        alert(
          manifestData?.error ||
            "Unable to generate Manifest."
        );

        return;
      }

      if (!manifestData?.manifestNumber) {
        console.error(
          "Manifest response:",
          manifestData
        );

        alert(
          "Manifest was generated but no Manifest Number was returned."
        );

        return;
      }

      // ---------------------------------------------
      // STEP 3: OPEN MANIFEST PREVIEW
      // ---------------------------------------------

      window.location.href =
        "/portal/manifest/preview?manifest=" +
        encodeURIComponent(
          manifestData.manifestNumber
        );

    } catch (error) {
      console.error(
        "Save & Generate error:",
        error
      );

      alert(
        "Unable to save Loading Tally and generate Manifest."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="grid grid-cols-3 gap-6">

        <div>
          <div className="text-sm text-slate-500">
            Shipments
          </div>

          <div className="text-2xl font-bold">
            {shipments.length}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-500">
            Pieces
          </div>

          <div className="text-2xl font-bold">
            {totalPieces}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-500">
            Weight
          </div>

          <div className="text-2xl font-bold">
            {totalWeight} Kg
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <button
          type="button"
          onClick={saveAndGenerate}
          disabled={loading || !shipments.length}
          className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating Manifest..."
            : "Save & Generate Manifest"}
        </button>

      </div>

    </section>
  );
}
