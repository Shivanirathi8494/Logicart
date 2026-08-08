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

  if(!challan){

    return(

      <div className="flex h-screen items-center justify-center">

        Loading Delivery Challan...

      </div>

    );

  }

  return(

<div className="min-h-screen bg-slate-200 py-10">

<div className="mx-auto mb-6 flex w-[210mm] justify-end gap-3 print:hidden">

<button
onClick={handlePrint}
className="rounded bg-blue-600 px-6 py-3 text-white"
>

Print

</button>

<button
onClick={()=>history.back()}
className="rounded border bg-white px-6 py-3"
>

Back

</button>

</div>

<div
ref={printRef}
className="mx-auto w-[210mm] bg-white shadow-xl print:shadow-none"
>

<PrintableDeliveryChallan
challan={challan}
/>

</div>

</div>

);

}
