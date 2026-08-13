"use client";

import { useState } from "react";

import LoadingTallySearch from "@/features/outscan/components/LoadingTallySearch";
import LoadingTallyTable from "@/features/outscan/components/LoadingTallyTable";
import LoadingTallySummary from "@/features/outscan/components/LoadingTallySummary";

import LoadingTallyList from "./components/LoadingTallyList";
import LoadingTallyGroups from "./components/LoadingTallyGroups";

export default function ManifestPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loadingTally, setLoadingTally] = useState<any>(null);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Loading & Manifest
        </h1>

        <p className="mt-2 text-slate-500">
          Add BOOKED AWBs, create a Loading Tally, and generate the Manifest.
        </p>
      </div>

      {/* -------------------------------------------------- */}
      {/* NEW LOADING TALLY / MANIFEST                       */}
      {/* -------------------------------------------------- */}

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">
            Create Loading Tally
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Only BOOKED AWBs can be added.
          </p>
        </div>

        <LoadingTallySearch
          shipments={shipments}
          setShipments={setShipments}
        />

        <LoadingTallyTable
          shipments={shipments}
          setShipments={setShipments}
        />

        <LoadingTallySummary
          shipments={shipments}
        />
      </section>

      {/* -------------------------------------------------- */}
      {/* EXISTING OPEN LOADING TALLIES                      */}
      {/* -------------------------------------------------- */}

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">
            Open Loading Tallies
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Continue a saved Loading Tally and generate its Manifest.
          </p>
        </div>

        <LoadingTallyList
          onSelect={setLoadingTally}
        />
      </section>

      {/* -------------------------------------------------- */}
      {/* MANIFEST GENERATION                                */}
      {/* -------------------------------------------------- */}

      {loadingTally && (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">
              Manifest Generation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loadingTally.loadingTallyNumber}
            </p>
          </div>

          <LoadingTallyGroups
            loadingTally={loadingTally}
          />
        </section>
      )}

    </div>
  );
}
