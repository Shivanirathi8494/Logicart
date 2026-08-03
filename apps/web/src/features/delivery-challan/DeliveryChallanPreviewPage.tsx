"use client";

import { useEffect,useRef,useState } from "react";
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

    const data=await response.json();

    setChallan(data);

  }

  const handlePrint=useReactToPrint({
    contentRef:printRef,
    documentTitle:challan?.challanNumber,
  });

  if(!challan){

    return(
      <div className="p-10">
        Loading...
      </div>
    );

  }

  return(

<div className="space-y-6">

<div className="flex justify-end gap-4 print:hidden">

<button
onClick={handlePrint}
className="rounded-lg bg-blue-600 px-6 py-3 text-white"
>

Print

</button>

<button
onClick={()=>window.history.back()}
className="rounded-lg border px-6 py-3"
>

Back

</button>

</div>

<div ref={printRef}>

<PrintableDeliveryChallan
challan={challan}
/>

</div>

</div>

);

}
