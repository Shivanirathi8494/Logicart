"use client";

export default function LoadingTallyTable({
  shipments,
  setShipments,
}: any){

  function remove(id:string){

    setShipments(
      shipments.filter(
        (s:any)=>s.id!==id
      )
    );

  }

  return(

<section className="overflow-hidden rounded-xl border bg-white shadow-sm">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">

AWB Number

</th>

<th className="p-4">

Origin

</th>

<th className="p-4">

Destination

</th>

<th className="p-4">

Pieces

</th>

<th className="p-4">

Weight

</th>

<th className="p-4">

Action

</th>

</tr>

</thead>

<tbody>

{shipments.map((shipment:any)=>(

<tr
key={shipment.id}
className="border-t"
>

<td className="p-4 font-medium">

{shipment.trackingNumber}

</td>

<td className="p-4 text-center">

{shipment.origin}

</td>

<td className="p-4 text-center">

{shipment.destination}

</td>

<td className="p-4 text-center">

{shipment.packageCount}

</td>

<td className="p-4 text-center">

{shipment.chargeableWeight} Kg

</td>

<td className="p-4 text-center">

<button
onClick={()=>remove(shipment.id)}
className="rounded bg-red-600 px-4 py-2 text-white"
>

Remove

</button>

</td>

</tr>

))}

{!shipments.length&&(

<tr>

<td
colSpan={6}
className="p-10 text-center text-slate-500"
>

No AWBs Added

</td>

</tr>

)}

</tbody>

</table>

</section>

);

}
