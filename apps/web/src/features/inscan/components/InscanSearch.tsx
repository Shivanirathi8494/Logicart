"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function InscanSearch({
  onFound,
}: any) {

  const params = useSearchParams();

  const [manifestNumber,setManifestNumber]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{

    const manifest=params.get("manifest");

    if(manifest){

      setManifestNumber(manifest);

      search(manifest);

    }

  },[]);

  async function search(number?:string){

    const value=number??manifestNumber;

    if(!value.trim()){

      alert("Please enter Manifest Number.");

      return;

    }

    setLoading(true);

    const response=await fetch(
      "/api/manifests/"+value
    );

    if(response.ok){

      onFound(await response.json());

    }else{

      alert("Manifest not found.");

    }

    setLoading(false);

  }

  return(

<section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

<label className="mb-2 block text-sm font-medium">

Manifest Number

</label>

<div className="flex flex-col gap-3 sm:flex-row">

<input
className="min-h-11 w-full flex-1 rounded-lg border p-3 text-base"
placeholder="MNF-CCU-296-00000051"
value={manifestNumber}
onChange={(e)=>setManifestNumber(e.target.value)}
onKeyDown={(e)=>{

if(e.key==="Enter"){

search();

}

}}
/>

<button
onClick={()=>search()}
disabled={loading}
className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white disabled:opacity-50 sm:w-auto sm:px-8"
>

{loading?"Searching...":"Search"}

</button>

</div>

</section>

);

}
