"use client";

export default function PrintableManifest({
  manifest,
}:{
  manifest:any;
}){

  const totalPieces = manifest.shipments.reduce(
    (sum:number,s:any)=>sum+s.shipment.packageCount,
    0
  );

  const totalWeight = manifest.shipments.reduce(
    (sum:number,s:any)=>sum+s.shipment.chargeableWeight,
    0
  );

  return(

<div className="mx-auto max-w-7xl bg-white p-10">

<div className="mb-8 text-center">

<h1 className="text-4xl font-bold">

LOGICARTS EXPRESS

</h1>

<p className="text-xl">

AIR CARGO MANIFEST

</p>

</div>

<hr className="mb-8"/>

<div className="mb-8 grid grid-cols-2 gap-6">

<div>

<strong>Manifest No :</strong>

{" "}
{manifest.manifestNumber}

</div>

<div>

<strong>Date :</strong>

{" "}
{new Date(manifest.manifestDate).toLocaleDateString()}

</div>

<div>

<strong>Origin :</strong>

{" "}
{manifest.origin}

</div>

<div>

<strong>Destination :</strong>

{" "}
{manifest.destination}

</div>

<div>

<strong>Flight :</strong>

{" "}
{manifest.flightNumber || "-"}

</div>

<div>

<strong>Vehicle :</strong>

{" "}
{manifest.vehicleNumber || "-"}

</div>

</div>

<table className="w-full border-collapse border">

<thead>

<tr className="bg-slate-100">

<th className="border p-3">Tracking</th>

<th className="border p-3">Pieces</th>

<th className="border p-3">Contents</th>

<th className="border p-3">Weight</th>

<th className="border p-3">Origin</th>

<th className="border p-3">Destination</th>

</tr>

</thead>

<tbody>

{manifest.shipments.map((entry:any)=>(

<tr key={entry.id}>

<td className="border p-3">

{entry.shipment.trackingNumber}

</td>

<td className="border p-3 text-center">

{entry.shipment.packageCount}

</td>

<td className="border p-3">

{entry.shipment.contents || "-"}

</td>

<td className="border p-3 text-right">

{entry.shipment.chargeableWeight} Kg

</td>

<td className="border p-3">

{entry.shipment.origin}

</td>

<td className="border p-3">

{entry.shipment.destination}

</td>

</tr>

))}

</tbody>

</table>

<div className="mt-8 flex justify-end">

<div className="space-y-2">

<div>

Total Shipments :
<strong> {manifest.shipments.length}</strong>

</div>

<div>

Total Pieces :
<strong> {totalPieces}</strong>

</div>

<div>

Total Weight :
<strong> {totalWeight.toFixed(2)} Kg</strong>

</div>

</div>

</div>

</div>

);

}
