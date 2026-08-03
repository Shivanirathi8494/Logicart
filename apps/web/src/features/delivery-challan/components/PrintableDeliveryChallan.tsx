"use client";

export default function PrintableDeliveryChallan({
  challan,
}:{
  challan:any;
}){

  return(

<div className="mx-auto max-w-6xl bg-white p-10">

<div className="text-center mb-8">

<h1 className="text-4xl font-bold">

LOGICARTS EXPRESS

</h1>

<p className="text-xl">

DELIVERY CHALLAN

</p>

</div>

<div className="grid grid-cols-2 gap-6 mb-8">

<div>

<strong>Challan No :</strong>

{" "}

{challan.challanNumber}

</div>

<div>

<strong>Date :</strong>

{" "}

{new Date(challan.challanDate).toLocaleDateString()}

</div>

<div>

<strong>Customer :</strong>

{" "}

{challan.customerName}

</div>

<div>

<strong>Phone :</strong>

{" "}

{challan.customerPhone}

</div>

<div className="col-span-2">

<strong>Address :</strong>

{" "}

{challan.customerAddress}

</div>

</div>

<table className="w-full border">

<thead>

<tr className="bg-slate-100">

<th className="border p-3">Tracking</th>

<th className="border p-3">Pieces</th>

<th className="border p-3">Weight</th>

<th className="border p-3">Destination</th>

</tr>

</thead>

<tbody>

{challan.shipments.map((item:any)=>(

<tr key={item.id}>

<td className="border p-3">

{item.shipment.trackingNumber}

</td>

<td className="border p-3">

{item.shipment.packageCount}

</td>

<td className="border p-3">

{item.shipment.chargeableWeight} Kg

</td>

<td className="border p-3">

{item.shipment.destination}

</td>

</tr>

))}

</tbody>

</table>

<div className="grid grid-cols-2 mt-20">

<div>

Receiver Signature

</div>

<div className="text-right">

Authorized Signatory

</div>

</div>

</div>

);

}
