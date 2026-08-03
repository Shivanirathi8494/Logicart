"use client";

type Props = {
  shipments:any[];
};

export default function ShipmentTable({
  shipments,
}:Props){

function removeShipment(id:string){

// Temporary
alert("Remove functionality coming next");

}

return(

<section className="overflow-hidden rounded-xl border bg-white shadow-sm">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">
Tracking No
</th>

<th className="p-4 text-center">
Pieces
</th>

<th className="p-4 text-left">
Nature of Goods
</th>

<th className="p-4 text-right">
Weight
</th>

<th className="p-4 text-center">
Origin
</th>

<th className="p-4 text-center">
Destination
</th>

<th className="p-4 text-center">
Action
</th>

</tr>

</thead>

<tbody>

{shipments.length===0 && (

<tr>

<td
colSpan={7}
className="p-10 text-center text-slate-500"
>

No shipment added.

</td>

</tr>

)}

{shipments.map((shipment)=>(

<tr
key={shipment.id}
className="border-t"
>

<td className="p-4 font-semibold">
{shipment.trackingNumber}
</td>

<td className="p-4 text-center">
{shipment.packageCount}
</td>

<td className="p-4">
{shipment.contents || "-"}
</td>

<td className="p-4 text-right">
{shipment.chargeableWeight} Kg
</td>

<td className="p-4 text-center">
{shipment.origin}
</td>

<td className="p-4 text-center">
{shipment.destination}
</td>

<td className="p-4 text-center">

<button
onClick={()=>removeShipment(shipment.id)}
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
