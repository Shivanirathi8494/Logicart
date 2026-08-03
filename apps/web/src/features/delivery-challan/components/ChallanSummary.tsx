"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  shipments: any[];
};

export default function ChallanSummary({
  shipments,
}: Props) {

  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const totalPieces = shipments.reduce(
    (sum:number,s:any)=>sum+s.packageCount,
    0
  );

  const totalWeight = shipments.reduce(
    (sum:number,s:any)=>sum+s.chargeableWeight,
    0
  );

  async function generate(){

    if(!shipments.length){
      alert("Please add at least one shipment.");
      return;
    }

    if(!customerName){
      alert("Customer Name is required.");
      return;
    }

    const response = await fetch(
      "/api/delivery-challans",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({

          origin:shipments[0].origin,

          customerName,
          customerAddress,
          customerPhone,

          flightNumber,
          vehicleNumber,
          remarks,

          shipments:shipments.map((s:any)=>s.id),

        }),
      }
    );

    const data = await response.json();

    if(!response.ok){
      alert(data.error || "Unable to create Delivery Challan");
      return;
    }

    router.push(
      "/portal/delivery/challan/"+data.challanNumber
    );

  }

  return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<div className="grid gap-4 md:grid-cols-2">

<input
className="rounded-lg border p-3"
placeholder="Customer Name"
value={customerName}
onChange={(e)=>setCustomerName(e.target.value)}
/>

<input
className="rounded-lg border p-3"
placeholder="Customer Mobile"
value={customerPhone}
onChange={(e)=>setCustomerPhone(e.target.value)}
/>

<input
className="rounded-lg border p-3 md:col-span-2"
placeholder="Customer Address"
value={customerAddress}
onChange={(e)=>setCustomerAddress(e.target.value)}
/>

<input
className="rounded-lg border p-3"
placeholder="Flight Number"
value={flightNumber}
onChange={(e)=>setFlightNumber(e.target.value)}
/>

<input
className="rounded-lg border p-3"
placeholder="Vehicle Number"
value={vehicleNumber}
onChange={(e)=>setVehicleNumber(e.target.value)}
/>

<textarea
className="rounded-lg border p-3 md:col-span-2"
placeholder="Remarks"
value={remarks}
onChange={(e)=>setRemarks(e.target.value)}
/>

</div>

<div className="mt-8 grid grid-cols-3 gap-6">

<div>

<div className="text-sm text-slate-500">
Total Shipments
</div>

<div className="text-3xl font-bold">
{shipments.length}
</div>

</div>

<div>

<div className="text-sm text-slate-500">
Total Pieces
</div>

<div className="text-3xl font-bold">
{totalPieces}
</div>

</div>

<div>

<div className="text-sm text-slate-500">
Total Weight
</div>

<div className="text-3xl font-bold">
{totalWeight.toFixed(2)} Kg
</div>

</div>

</div>

<div className="mt-8 flex justify-end">

<button
onClick={generate}
className="rounded-lg bg-blue-600 px-8 py-3 text-white"
>

Generate Delivery Challan

</button>

</div>

</section>

);

}
