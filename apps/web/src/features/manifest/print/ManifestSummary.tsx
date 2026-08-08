"use client";

export default function ManifestSummary({
  shipments,
}: any) {

  const rows = Array.isArray(shipments)
    ? shipments
    : [];

  const totalPieces = rows.reduce(
    (sum:number,s:any)=>
      sum + Number(s?.shipment?.packageCount ?? 0),
    0
  );

  const totalWeight = rows.reduce(
    (sum:number,s:any)=>
      sum + Number(s?.shipment?.chargeableWeight ?? 0),
    0
  );

  return (

<div className="mt-4 flex justify-end">

<table className="border-collapse border border-black text-[11px]">

<tbody>

<tr>

<td className="border border-black px-4 py-2 font-semibold">

Total Shipments

</td>

<td className="border border-black px-4 py-2 text-center">

{rows.length}

</td>

</tr>

<tr>

<td className="border border-black px-4 py-2 font-semibold">

Total Pieces

</td>

<td className="border border-black px-4 py-2 text-center">

{totalPieces}

</td>

</tr>

<tr>

<td className="border border-black px-4 py-2 font-semibold">

Total Weight (Kg)

</td>

<td className="border border-black px-4 py-2 text-center">

{totalWeight.toFixed(2)}

</td>

</tr>

</tbody>

</table>

</div>

);

}
