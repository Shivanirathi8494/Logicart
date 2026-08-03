"use client";

import { useState } from "react";

export default function SearchShipment({onFound}:any){

const [tracking,setTracking]=useState("");

async function search(){

const res=await fetch(
"/api/dockets?tracking="+tracking
);

const data=await res.json();

if(data.length){

onFound(data[0]);

}else{

alert("Shipment not found");

}

}

return(

<section className="rounded-xl border bg-white p-6">

<div className="flex gap-4">

<input
className="flex-1 rounded-lg border p-3"
placeholder="Tracking Number"
value={tracking}
onChange={(e)=>setTracking(e.target.value)}
/>

<button
onClick={search}
className="rounded-lg bg-[#1877F2] px-6 text-white"
>

Search

</button>

</div>

</section>

);

}
