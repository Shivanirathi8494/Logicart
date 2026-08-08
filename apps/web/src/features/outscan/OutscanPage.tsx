"use client";

import { useState } from "react";

import LoadingTallySearch from "./components/LoadingTallySearch";
import LoadingTallyTable from "./components/LoadingTallyTable";
import LoadingTallySummary from "./components/LoadingTallySummary";

export default function OutscanPage(){

  const [shipments,setShipments]=useState<any[]>([]);

  return(

<div className="space-y-8">

<div>

<h1 className="text-3xl font-bold">

Loading Tally

</h1>

<p className="mt-2 text-slate-500">

Scan or enter AWB Numbers for today's loading.

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

</div>

);

}
