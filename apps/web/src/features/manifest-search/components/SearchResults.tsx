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

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4">

Manifest No

</th>

<th className="p-4">

Date

</th>

<th className="p-4">

Origin

</th>

<th className="p-4">

Destination

</th>

<th className="p-4">

Status

</th>

<th className="p-4">

Actions

</th>

</tr>

</thead>

<tbody>

{rows.map((row:any)=>(

<tr
key={row.id}
className="border-t"
>

<td className="p-4">

{row.manifestNumber}

</td>

<td className="p-4">

{new Date(
row.manifestDate
).toLocaleDateString()}

</td>

<td className="p-4">

{row.origin}

</td>

<td className="p-4">

{row.destination}

</td>

<td className="p-4">

{row.status}

</td>

<td className="p-4">

<div className="flex gap-2">

<button
onClick={()=>
router.push(
"/portal/warehouse/manifest/"+row.manifestNumber
)
}
className="rounded border px-4 py-2"
>

Preview

</button>

<button
onClick={()=>
window.open(
"/portal/warehouse/manifest/"+row.manifestNumber,
"_blank"
)
}
className="rounded border px-4 py-2"
>

Print

</button>

</div>

</td>

</tr>

))}

</tbody>

</table>

</section>

);

}
