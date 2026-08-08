"use client";

import { useState } from "react";

export default function LoadingTallySearch({
  shipments,
  setShipments,
}: any) {

  const [awb,setAwb]=useState("");

  async function addShipment(){

    if(!awb.trim()){

      alert("Please enter AWB Number.");

      return;

    }

    const response=await fetch(
      "/api/dockets?tracking="+encodeURIComponent(awb)
    );

    const data=await response.json();

    if(!data.length){

      alert("AWB not found.");

      return;

    }

    const shipment=data[0];

    if(
      shipments.find(
        (s:any)=>s.id===shipment.id
      )
    ){

      alert("AWB already added.");

      return;

    }

    setShipments([
      ...shipments,
      shipment,
    ]);

    setAwb("");

  }

  return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<div className="flex gap-3">

<input
className="flex-1 rounded-lg border p-3"
placeholder="Enter AWB Number"
value={awb}
onChange={(e)=>setAwb(e.target.value)}
onKeyDown={(e)=>{

if(e.key==="Enter"){

addShipment();

}

}}
/>

<button
onClick={addShipment}
className="rounded-lg bg-blue-600 px-8 py-3 text-white"
>

Add AWB

</button>

</div>

</section>

);

}
