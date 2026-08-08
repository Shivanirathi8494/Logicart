"use client";

import { useState } from "react";

export default function InscanManifestTable({
  manifest,
}: any) {

  const [selected, setSelected] = useState<string[]>(
    manifest.shipments.map(
      (s:any)=>s.shipment.trackingNumber
    )
  );

  function toggle(tracking:string){

    setSelected(prev=>

      prev.includes(tracking)

      ? prev.filter(x=>x!==tracking)

      : [...prev,tracking]

    );

  }

  async function updateStatus(status:string){

    const trackingNumbers =
      status==="INSCAN"
      ? selected
      : manifest.shipments
          .map((s:any)=>s.shipment.trackingNumber)
          .filter((t:string)=>!selected.includes(t));

    if(!trackingNumbers.length){

      alert("No shipments selected.");

      return;

    }

    const response=await fetch(
      "/api/dockets/bulk-status",
      {

        method:"PATCH",

        headers:{
          "Content-Type":"application/json",
        },

        body:JSON.stringify({

          trackingNumbers,

          status,

          remarks:
            status==="INSCAN"
            ? "Shipment received at warehouse"
            : "Shipment not received",

        }),

      }
    );

    if(response.ok){

      alert("Status updated successfully.");

      await fetch(
        "/api/manifests/"+manifest.manifestNumber+"/close",
        {
          method:"PATCH",
        }
      );

      location.reload();

    }else{

      alert("Unable to update shipment status.");

    }

  }

  return(

<section className="rounded-xl border bg-white shadow-sm">

<div className="border-b p-5">

<h2 className="text-xl font-semibold">

Manifest : {manifest.manifestNumber}

</h2>

<div className="mt-2 text-slate-500">

Origin : {manifest.origin}

&nbsp;&nbsp;&nbsp;

Destination : {manifest.destination}

</div>

</div>

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-3 text-center">

<input
type="checkbox"
checked={
selected.length===manifest.shipments.length
}
onChange={(e)=>{

if(e.target.checked){

setSelected(

manifest.shipments.map(
(s:any)=>s.shipment.trackingNumber
)

);

}else{

setSelected([]);

}

}}
/>

</th>

<th className="p-3 text-left">AWB Number</th>

<th className="p-3 text-center">Pieces</th>

<th className="p-3 text-right">Weight</th>

<th className="p-3 text-center">Status</th>

</tr>

</thead>

<tbody>

{manifest.shipments
.filter(
(item:any)=>item.shipment.status==="MANIFESTED"
)
.map((item:any)=>(

<tr
key={item.shipment.id}
className="border-t"
>

<td className="p-3 text-center">

<input
type="checkbox"
disabled={item.shipment.status!=="MANIFESTED"}
checked={selected.includes(item.shipment.trackingNumber)}
onChange={()=>
toggle(item.shipment.trackingNumber)
}
/>

</td>

<td className="p-3">

{item.shipment.trackingNumber}

</td>

<td className="p-3 text-center">

{item.shipment.packageCount}

</td>

<td className="p-3 text-right">

{item.shipment.chargeableWeight}

</td>

<td className="p-3 text-center">

<span
className={
item.shipment.status==="MANIFESTED"
? "rounded bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
: item.shipment.status==="INSCAN"
? "rounded bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
: item.shipment.status==="NOT_DELIVERED"
? "rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
: "rounded bg-slate-100 px-3 py-1 text-xs"
}
>

{item.shipment.status}

</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

<div className="flex items-center justify-between border-t bg-slate-50 p-5">

<div>

<div className="flex gap-8">

<div>

Selected :

<strong> {selected.length}</strong>

</div>

<div>

Shipments :

<strong> {manifest.shipments.length}</strong>

</div>

<div>

Pieces :

<strong>

{manifest.shipments.reduce(
(a:number,b:any)=>
a+b.shipment.packageCount,
0
)}

</strong>

</div>

<div>

Weight :

<strong>

{manifest.shipments.reduce(
(a:number,b:any)=>
a+b.shipment.chargeableWeight,
0
)} Kg

</strong>

</div>

</div>

</div>

<div className="flex gap-3">

<button
onClick={()=>updateStatus("INSCAN")}
className="rounded bg-green-600 px-6 py-3 text-white"
>

Inscan Selected

</button>

<button
onClick={()=>updateStatus("NOT_DELIVERED")}
className="rounded bg-red-600 px-6 py-3 text-white"
>

Mark Not Delivered

</button>

</div>

</div>

</section>

);

}
