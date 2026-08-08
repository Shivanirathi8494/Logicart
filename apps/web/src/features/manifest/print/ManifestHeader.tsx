"use client";

import Image from "next/image";

export default function ManifestHeader({
  manifest,
}: any) {

  const totalWeight = manifest.shipments.reduce(
    (sum:number,s:any)=>sum+s.shipment.chargeableWeight,
    0
  );

  return (

<div>

{/* ================= TOP ROW ================= */}

<table className="w-full border-collapse border border-black text-[11px]">

<tbody>

<tr>

<td className="border border-black p-1 w-20">

{new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit",
})}

</td>

<td className="border border-black p-1 w-24">

{new Date(
manifest.manifestDate
).toLocaleDateString("en-GB")}

</td>

<td className="border border-black text-center">

<div className="flex items-center justify-center gap-4">

<Image
src="/logo/logicarts-logo.png"
alt="Logicarts"
width={45}
height={45}
/>

<div>

<div className="text-xl font-bold">

LOGICARTS

</div>

<div className="font-semibold">

AIR CARGO MANIFEST

</div>

</div>

</div>

</td>

<td className="border border-black p-1 w-24 text-center">

PAGE : 1-1

</td>

</tr>

</tbody>

</table>

{/* ================= OWNER ================= */}

<table className="w-full border-collapse border-x border-b border-black text-[11px]">

<tbody>

<tr>

<td className="border border-black p-2">

OWNER / OPERATOR – LOGICARTS

</td>

<td className="border border-black p-2">

ISSUED BY

</td>

</tr>

</tbody>

</table>

{/* ================= FLIGHT ================= */}

<table className="w-full border-collapse border-x border-b border-black text-[11px]">

<tbody>

<tr>

<td className="border border-black p-2">

A/C REGISTRATION NO -

</td>

<td className="border border-black p-2">

FLIGHT NO : {manifest.flightNumber}

</td>

<td className="border border-black p-2">

DATE :
{" "}
{new Date(
manifest.manifestDate
).toLocaleDateString("en-GB")}

</td>

<td className="border border-black p-2">

WEIGHT IN KG :
{" "}
{totalWeight.toFixed(2)}

</td>

</tr>

</tbody>

</table>

{/* ================= DEPARTURE ================= */}

<table className="w-full border-collapse border-x border-b border-black text-[11px]">

<tbody>

<tr>

<td className="border border-black p-2 font-semibold">

DEPARTURE

</td>

</tr>

</tbody>

</table>

{/* ================= LADING ================= */}

<table className="mb-4 w-full border-collapse border-x border-b border-black text-[11px]">

<tbody>

<tr>

<td className="border border-black p-2">

POINT OF LADING –

<strong>

{" "}
{manifest.origin}

</strong>

</td>

<td className="border border-black p-2">

POINT OF UNLADING –

<strong>

{" "}
{manifest.destination}

</strong>

</td>

</tr>

</tbody>

</table>

</div>

);

}
