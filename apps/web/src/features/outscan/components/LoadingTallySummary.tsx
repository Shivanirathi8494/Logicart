"use client";

import { useState } from "react";

export default function LoadingTallySummary({
  shipments,
}: any) {
  const [loading, setLoading] = useState(false);

  const allPackages = shipments.flatMap(
    (shipment: any) => shipment.packages || []
  );

  const totalPieces = allPackages.length;

  const loadedPackages = allPackages.filter(
    (pkg: any) => pkg.loadingSelected !== false
  );

  const notLoadedPackages = allPackages.filter(
    (pkg: any) => pkg.loadingSelected === false
  );

  const loadedWeight = loadedPackages.reduce(
    (total: number, pkg: any) =>
      total + Number(pkg.weight || 0),
    0
  );

  async function saveAndGenerate() {
    if (!shipments.length) {
      alert("Please add at least one INSCAN shipment.");
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

    const shipmentsWithoutPackages =
      shipments.filter(
        (shipment: any) =>
          !Array.isArray(shipment.packages) ||
          shipment.packages.length === 0
      );

    if (shipmentsWithoutPackages.length) {
      alert(
        "Package details are missing for one or more AWBs. Remove them and add them again from Ready for Dispatch."
      );
      return;
    }

    const missingRemarks =
      notLoadedPackages.filter(
        (pkg: any) =>
          !String(pkg.loadingRemark || "").trim()
      );

    if (missingRemarks.length) {
      alert(
        "Please enter a remark for every piece that is not being loaded."
      );
      return;
    }

    if (!loadedPackages.length) {
      alert(
        "At least one piece must be selected for loading."
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

            packages: allPackages.map(
              (pkg: any) => ({
                packageId: pkg.id,
                loaded:
                  pkg.loadingSelected !== false,
                remarks:
                  pkg.loadingSelected === false
                    ? String(
                        pkg.loadingRemark || ""
                      ).trim()
                    : "",
              })
            ),
          }),
        }
      );

      const tallyData = await tallyResponse.json();

      /*
       * If this AWB already has a Loading Tally,
       * reuse the existing tally instead of
       * treating it as an error.
       */
      if (!tallyResponse.ok) {
        const reusableExistingTally =
          tallyResponse.status === 409 &&
          tallyData?.id;

        if (!reusableExistingTally) {
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

        console.info(
          "Reusing existing Loading Tally:",
          tallyData.loadingTallyNumber
        );
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
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">

        <div>
          <div className="text-sm text-slate-500">
            Total Pieces
          </div>

          <div className="mt-1 text-xl font-bold text-[#0b2340] sm:text-2xl">
            {loadedPackages.length}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-500">
            Loading
          </div>

          <div className="mt-1 text-xl font-bold text-[#0b2340] sm:text-2xl">
            {totalPieces}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-500">
            Not Loading
          </div>

          <div className="mt-1 text-xl font-bold text-[#0b2340] sm:text-2xl">
            {notLoadedPackages.length}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-500">
            Loading Weight
          </div>

          <div className="mt-1 text-xl font-bold text-[#0b2340] sm:text-2xl">
            {loadedWeight.toFixed(2)} Kg
          </div>
        </div>

      </div>

      <div className="mt-6 flex sm:mt-8 sm:justify-end">

        <button
          type="button"
          onClick={saveAndGenerate}
          disabled={loading || !shipments.length}
          className="min-h-11 w-full rounded-lg bg-[#ff7417] px-6 py-3 font-semibold text-white transition hover:bg-[#e9680d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {loading
            ? "Creating Manifest..."
            : "Generate Manifest"}
        </button>

      </div>

    </section>
  );
}
