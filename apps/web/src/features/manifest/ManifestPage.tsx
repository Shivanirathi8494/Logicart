"use client";

import { useState } from "react";

import LoadingTallySearch from "./components/LoadingTallySearch";
import LoadingTallyList from "./components/LoadingTallyList";
import LoadingTallyGroups from "./components/LoadingTallyGroups";

export default function ManifestPage() {

  const [loadingTally, setLoadingTally] = useState<any>(null);

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Manifest Generation

        </h1>

        <p className="mt-2 text-slate-500">

          Search a Loading Tally and generate manifests route-wise.

        </p>

      </div>

      <LoadingTallyList
        onSelect={setLoadingTally}
      />

      <LoadingTallySearch
        onFound={setLoadingTally}
      />

      {loadingTally && (

        <LoadingTallyGroups
          loadingTally={loadingTally}
        />

      )}

    </div>

  );

}
