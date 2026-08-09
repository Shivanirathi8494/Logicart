"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import InscanSearch from "./components/InscanSearch";
import InscanManifestSummary from "./components/InscanManifestSummary";
import InscanManifestTable from "./components/InscanManifestTable";

function InscanContent() {

  const params = useSearchParams();

  const manifestNumber = params.get("manifest");

  const [manifest,setManifest]=useState<any>(null);

  useEffect(()=>{

    if(!manifestNumber){

      return;

    }

    loadManifest();

  },[manifestNumber]);

  async function loadManifest(){

    const response = await fetch(

      "/api/manifests/"+manifestNumber

    );

    if(response.ok){

      setManifest(await response.json());

    }

  }

  return(

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Inscan

        </h1>

        <p className="mt-2 text-slate-500">

          Enter a Manifest Number to receive all shipments in the manifest.

        </p>

      </div>

      <InscanSearch
        onFound={setManifest}
      />

      {manifest && (

        <>

          <InscanManifestSummary
            manifest={manifest}
          />

          <InscanManifestTable
            manifest={manifest}
          />

        </>

      )}

    </div>

  );

}


export default function InscanPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <InscanContent />
    </Suspense>
  );
}
