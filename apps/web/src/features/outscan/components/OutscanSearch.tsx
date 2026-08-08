"use client";

import { useState } from "react";

export default function OutscanSearch({
  onFound,
}: any) {

  const [manifestNumber,setManifestNumber]=useState("");
  const [loading,setLoading]=useState(false);

  async function search(){

    if(!manifestNumber.trim()){

      alert("Please enter Manifest Number.");

      return;

    }

    setLoading(true);

    const response=await fetch(
      "/api/manifests/"+manifestNumber
    );

    if(response.ok){

      onFound(await response.json());

    }else{

      alert("Manifest not found.");

    }

    setLoading(false);

  }

  return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<label className="mb-2 block text-sm font-medium">

Manifest Number

</label>

<div className="flex gap-3">

<input
className="flex-1 rounded-lg border p-3"
placeholder="MNF-MAA-260807-000001"
value={manifestNumber}
onChange={(e)=>setManifestNumber(e.target.value)}
onKeyDown={(e)=>{

if(e.key==="Enter"){

search();

}

}}
/>

<button
onClick={search}
disabled={loading}
className="rounded-lg bg-[#1877F2] px-8 py-3 text-white disabled:opacity-50"
>

{loading?"Searching...":"Search"}

</button>

</div>

</section>

);

}
