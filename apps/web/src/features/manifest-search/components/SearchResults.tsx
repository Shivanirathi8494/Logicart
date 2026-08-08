"use client";

import { useRouter } from "next/navigation";

export default function SearchResults({
  rows,
}:{
  rows:any[];
}){

  const router=useRouter();

  if(!rows.length){

    return(

      <div className="rounded-xl border bg-white p-10 text-center">

        No Manifest Found

      </div>

    );

  }

  return(

<section className="overflow-hidden rounded-xl border bg-white shadow-sm">

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">Manifest No</th>

<th className="p-4">Date</th>

<th className="p-4">Origin</th>

<th className="p-4">Destination</th>

<th className="p-4">Flight</th>

<th className="p-4">Shipments</th>

<th className="p-4">Weight</th>

<th className="p-4">Status</th>

<th className="p-4">Actions</th>

</tr>

</thead>

<tbody>

{rows.map((row:any)=>{

const totalWeight=row.shipments.reduce(
(a:number,b:any)=>
a+Number(
  b?.shipment?.chargeableWeight ??
  b?.chargeableWeight ??
  0
),
0
);

return(

<tr
key={row.id}
className="border-t hover:bg-slate-50"
>

<td className="p-4 font-medium">

{row.manifestNumber}

</td>

<td className="p-4 text-center">

{new Date(row.manifestDate).toLocaleDateString()}

</td>

<td className="p-4 text-center">

{row.origin}

</td>

<td className="p-4 text-center">

{row.destination}

</td>

<td className="p-4 text-center">

{row.flightNumber}

</td>

<td className="p-4 text-center">

{row.shipments.length}

</td>

<td className="p-4 text-center">

{totalWeight} Kg

</td>

<td className="p-4 text-center">

<span
className={
row.status==="OPEN"
? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
: "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
}
>

{row.status}

</span>

</td>

<td className="p-4">

<div className="flex justify-center gap-2">

<button
onClick={()=>
router.push(
"/portal/manifest/preview?manifest="+row.manifestNumber
)
}
className="rounded-lg border px-4 py-2 hover:bg-slate-100"
>

Preview

</button>

<button
onClick={()=>
window.open(
"/portal/manifest/preview?manifest="+row.manifestNumber,
"_blank"
)
}
className="rounded-lg border px-4 py-2 hover:bg-slate-100"
>

Print

</button>

<button
onClick={()=>
router.push(
"/portal/warehouse/inscan?manifest="+row.manifestNumber
)
}
className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
>

Inscan

</button>

</div>

</td>

</tr>

);

})}

</tbody>

</table>

</div>

</section>

);

}
