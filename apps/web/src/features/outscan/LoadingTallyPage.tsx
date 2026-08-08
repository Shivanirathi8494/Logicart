"use client";

import { useEffect,useState } from "react";

export default function LoadingTallyPage({
loadingTallyNumber,
}:{
loadingTallyNumber:string;
}){

const [tally,setTally]=useState<any>();

useEffect(()=>{

load();

},[]);

async function load(){

const response=await fetch(
"/api/loading-tallies/"+loadingTallyNumber
);

setTally(
await response.json()
);

}

if(!tally){



const groups = Object.values(

  tally.shipments.reduce(

    (acc:any,item:any)=>{

      const key =
        item.shipment.origin +
        "->" +
        item.shipment.destination;

      if(!acc[key]){

        acc[key]={

          origin:item.shipment.origin,
          destination:item.shipment.destination,
          shipments:[],

        };

      }

      acc[key].shipments.push(item.shipment);

      return acc;

    },

    {}

  )

);




async function generateManifest(group:any){

  const response = await fetch(
    "/api/loading-tallies/generate-manifest",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({

        origin:group.origin,

        destination:group.destination,

        shipments:group.shipments,

      }),
    }
  );

  if(response.ok){

    const manifest = await response.json();

    window.open(
      "/portal/manifest/preview?manifest="+
      manifest.manifestNumber,
      "_blank"
    );

  }else{

    alert("Unable to generate manifest.");

  }

}


return(
<div className="p-10">

Loading...

</div>
);

}

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">

{tally.loadingTallyNumber}

</h1>


<div className="space-y-6">

{groups.map((group:any,index:number)=>(

<section
key={index}
className="rounded-xl border bg-white p-6 shadow-sm"
>

<div className="flex items-center justify-between">

<div>

<h2 className="text-xl font-bold">

{group.origin} → {group.destination}

</h2>

<div className="text-slate-500">

Shipments : {group.shipments.length}

</div>

</div>

<button
onClick={()=>generateManifest(group)}
className="rounded-lg bg-green-600 px-6 py-3 text-white"
>

Generate Manifest

</button>

</div>

<div className="mt-6 overflow-x-auto">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-3 text-left">

AWB Number

</th>

<th className="p-3 text-center">

Pieces

</th>

<th className="p-3 text-right">

Weight

</th>

</tr>

</thead>

<tbody>

{group.shipments.map((shipment:any)=>(

<tr
key={shipment.id}
className="border-t"
>

<td className="p-3">

{shipment.trackingNumber}

</td>

<td className="p-3 text-center">

{shipment.packageCount}

</td>

<td className="p-3 text-right">

{shipment.chargeableWeight} Kg

</td>

</tr>

))}

</tbody>

</table>

</div>

</section>

))}

</div>


</div>

);

}
