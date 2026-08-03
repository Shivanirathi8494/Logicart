"use client";

import { useState } from "react";

export default function ShipmentSearch({
  onAdd,
}: any) {

  const [tracking,setTracking]=useState("");

  async function search(){

    if(!tracking){
      return;
    }

    const response=await fetch(
      "/api/dockets?tracking="+tracking
    );

    const rows=await response.json();

    const shipment=rows.find(
      (s:any)=>s.status==="OUTSCAN"
    );

    if(!shipment){
      alert("Shipment not found or not in OUTSCAN status.");
      return;
    }

    onAdd(shipment);

    setTracking("");

  }

  return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<div className="flex gap-4">

<input
className="flex-1 rounded-lg border p-3"
placeholder="Tracking Number"
value={tracking}
onChange={(e)=>setTracking(e.target.value)}
/>

<button
onClick={search}
className="rounded-lg bg-blue-600 px-6 text-white"
>

Add Shipment

</button>

</div>

</section>

);

}
