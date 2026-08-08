"use client";

import { useState } from "react";

export default function LoadingTallySummary({
  shipments,
}: any){

  const [loading,setLoading]=useState(false);

  const totalPieces=shipments.reduce(
    (a:number,b:any)=>a+b.packageCount,
    0
  );

  const totalWeight=shipments.reduce(
    (a:number,b:any)=>a+b.chargeableWeight,
    0
  );

  async function save(){

    if(!shipments.length){

      alert("Please add at least one AWB.");

      return;

    }

    setLoading(true);

    const response=await fetch(
      "/api/loading-tallies",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({

          loadingTallyNumber:
            "LT-"+Date.now(),

          loadingDate:
            new Date(),

          shipmentIds:
            shipments.map(
              (s:any)=>s.id
            ),

        }),
      }
    );

    setLoading(false);

    if(response.ok){

      alert(
        "Loading Tally Saved Successfully."
      );

    }else{

      const error = await response.text();

      console.error(error);

      alert(error);

    }

  }

  return(

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

<div className="mt-8 flex justify-end gap-4">

<button
onClick={save}
disabled={loading}
className="rounded-lg bg-blue-600 px-8 py-3 text-white disabled:opacity-50"
>

{loading
?"Saving..."
:"Save Loading Tally"}

</button>

<button
disabled
className="rounded-lg bg-green-600 px-8 py-3 text-white opacity-50"
>

Generate Manifest

</button>

</div>

</section>

);

}
