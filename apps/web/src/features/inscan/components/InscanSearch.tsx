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
onClick={()=>search()}
disabled={loading}
className="rounded-lg bg-[#1877F2] px-8 py-3 text-white disabled:opacity-50"
>

{loading?"Searching...":"Search"}

</button>

</div>

</section>

);

}
