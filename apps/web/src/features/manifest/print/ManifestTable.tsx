"use client";

export default function ManifestTable({
  shipments,
}: any) {

  const rows = Array.isArray(shipments)
  ? [...shipments]
  : [];

  // Airline manifests have a fixed table height.
  // Fill remaining rows with blank rows.
  while (rows.length < 18) {
    rows.push(null);
  }

  return (

<table className="w-full border-collapse border border-black text-[11px]">

<thead>

<tr className="bg-gray-100">

<th className="w-[24%] border border-black p-2 text-center font-semibold">

Airwaybill Number

</th>

<th className="w-[10%] border border-black p-2 text-center font-semibold">

No. of Pcs

</th>

<th className="w-[28%] border border-black p-2 text-center font-semibold">

Nature of Goods

</th>

<th className="w-[15%] border border-black p-2 text-center font-semibold">

Weight

</th>

<th className="w-[23%] border border-black p-2 text-center font-semibold">

Origin / Destination

</th>

</tr>

</thead>

<tbody>

{rows.map((row:any,index:number)=>(

<tr
key={index}
className="h-8"
>

<td className="border border-black px-2">

{row?.shipment?.trackingNumber ?? ""}

</td>

<td className="border border-black text-center">

{row?.shipment?.packageCount ?? ""}

</td>

<td className="border border-black px-2">

{row?.shipment?.contents || ""}

</td>

<td className="border border-black text-center">

{row
  ? Number(
      row?.shipment?.chargeableWeight ?? 0
    ).toFixed(2)
  : ""
}

</td>

<td className="border border-black text-center">

{row
? `${row.shipment.origin} / ${row.shipment.destination}`
: ""
}

</td>

</tr>

))}

</tbody>

</table>

);

}
