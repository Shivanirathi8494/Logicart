"use client";

export default function StatusHistory({shipment}:any){

return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<h2 className="mb-6 text-xl font-semibold">

Status History

</h2>

<div className="rounded-lg border p-4">

<div className="flex justify-between">

<span>

Shipment Created

</span>

<span>

{shipment.status}

</span>

</div>

<div className="mt-2 text-sm text-slate-500">

{new Date(shipment.createdAt).toLocaleString()}

</div>

</div>

</section>

);

}
