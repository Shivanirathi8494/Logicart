"use client";

export default function ShipmentCard({shipment}:any){

return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<h2 className="mb-6 text-xl font-semibold">
Shipment Details
</h2>

<div className="grid gap-6 md:grid-cols-3">

<div>
<label className="text-sm text-slate-500">AWB Number</label>
<div className="font-semibold">{shipment.trackingNumber}</div>
</div>

<div>
<label className="text-sm text-slate-500">Sender</label>
<div>{shipment.senderName}</div>
</div>

<div>
<label className="text-sm text-slate-500">Receiver</label>
<div>{shipment.receiverName}</div>
</div>

<div>
<label className="text-sm text-slate-500">Origin</label>
<div>{shipment.origin}</div>
</div>

<div>
<label className="text-sm text-slate-500">Destination</label>
<div>{shipment.destination}</div>
</div>

<div>
<label className="text-sm text-slate-500">Current Status</label>

<span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
{shipment.status}
</span>

</div>

</div>

</section>

);

}
