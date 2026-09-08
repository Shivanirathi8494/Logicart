"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import PrintableDeliveryChallan from "./components/PrintableDeliveryChallan";

export default function DeliveryChallanPreviewPage({
  challanNumber,
}:{
  challanNumber:string;
}){

  const [challan,setChallan]=useState<any>();

  const printRef=useRef<HTMLDivElement>(null);

  const [updating,setUpdating]=useState(false);

  useEffect(()=>{

    load();

  },[]);

  async function load(){

    const response=await fetch(
      "/api/delivery-challans/"+challanNumber
    );

    if(!response.ok){

      alert("Delivery Challan not found.");

      return;

    }

    const data=await response.json();

    setChallan(data);

  }

  const handlePrint=useReactToPrint({

    contentRef:printRef,

    documentTitle:challan?.challanNumber,

  });

  async function markDelivered(){

    const confirmed=window.confirm(
      challan.deliveryType === "AIRPORT_DELIVERY"
        ? "Complete airport / warehouse handover and mark all linked shipments as delivered?"
        : "Mark this Delivery Challan and all linked shipments as delivered?"
    );

    if(!confirmed){
      return;
    }

    try{

      setUpdating(true);

      const response=await fetch(
        "/api/delivery-challans/"+challanNumber,
        {
          method:"PATCH",
        }
      );

      const data=await response.json();

      if(!response.ok){
        alert(
          data?.error ||
          "Unable to mark delivery as completed."
        );
        return;
      }

      setChallan(data);

      alert(
        "Delivery marked as completed."
      );

    }catch(error){

      console.error(error);

      alert(
        "Unable to mark delivery as completed."
      );

    }finally{

      setUpdating(false);

    }

  }

  if(!challan){

    return(

      <div className="flex h-screen items-center justify-center">

        Loading Delivery Challan...

      </div>

    );

  }

  return(

<div className="min-h-screen overflow-x-hidden bg-slate-200 px-3 py-4 sm:px-6 sm:py-10 print:bg-white print:p-0">

<div className="mx-auto mb-4 flex w-full max-w-[210mm] flex-col gap-2 sm:mb-6 sm:flex-row sm:justify-end sm:gap-3 print:hidden">

<button
onClick={handlePrint}
className="min-h-11 w-full rounded-lg bg-[#0b2340] px-6 py-3 font-semibold text-white sm:w-auto"
>

Print

</button>

{challan.status === "OPEN" && (
<button
onClick={markDelivered}
disabled={updating}
className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white disabled:opacity-50 sm:w-auto"
>
{updating
  ? "Updating..."
  : challan.deliveryType === "AIRPORT_DELIVERY"
    ? "Complete Airport / Warehouse Handover"
    : "Mark Delivered"}
</button>
)}

{challan.status === "DELIVERED" && (
<div className="flex min-h-11 w-full items-center justify-center rounded-lg bg-green-100 px-5 py-3 font-semibold text-green-700 sm:w-auto">
Delivered
</div>
)}

<button
onClick={()=>history.back()}
className="min-h-11 w-full rounded-lg border bg-white px-6 py-3 font-semibold sm:w-auto"
>

Back

</button>

</div>

<div className="mx-auto w-full overflow-x-auto pb-4 print:overflow-visible print:pb-0">

<div
ref={printRef}
className="mx-auto w-[210mm] origin-top-left bg-white shadow-xl print:shadow-none"
>

<PrintableDeliveryChallan
challan={challan}
/>

</div>

</div>

</div>

);

}
