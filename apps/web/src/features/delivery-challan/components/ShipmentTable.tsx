"use client";

type Props = {
  shipments: any[];
};

export default function ShipmentTable({
  shipments,
}: Props) {

  if (!shipments.length) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
        No shipments selected.
      </div>
    );
  }

  return (

<section className="overflow-hidden rounded-xl border bg-white shadow-sm">

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">Tracking No</th>

<th className="p-4 text-left">Sender</th>

<th className="p-4 text-left">Receiver</th>

<th className="p-4 text-left">Origin</th>

<th className="p-4 text-left">Destination</th>

<th className="p-4 text-left">Pieces</th>

<th className="p-4 text-left">Weight</th>

<th className="p-4 text-center">Action</th>

</tr>

</thead>

<tbody>

{shipments.map((shipment,index)=>(

<tr
key={shipment.id}
className="border-t"
>

<td className="p-4 font-semibold">

{shipment.trackingNumber}

</td>

<td className="p-4">

{shipment.senderName}

</td>

<td className="p-4">

{shipment.receiverName}

</td>

<td className="p-4">

{shipment.origin}

</td>

<td className="p-4">

{shipment.destination}

</td>

<td className="p-4">

{shipment.packageCount}

</td>

<td className="p-4">

{shipment.chargeableWeight} Kg

</td>

<td className="p-4 text-center">

<button
onClick={()=>{
window.location.reload();
}}
className="rounded border px-3 py-2 text-red-600"
>

Remove

</button>

</td>

</tr>

))}

</tbody>

</table>

</section>

);

}
