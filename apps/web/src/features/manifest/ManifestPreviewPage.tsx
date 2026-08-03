"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import PrintableManifest from "./components/PrintableManifest";

export default function ManifestPreviewPage({
  manifestNumber,
}:{
  manifestNumber:string;
}){

  const [manifest,setManifest]=useState<any>();

  const printRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    load();
  },[]);

  async function load(){

    const response=await fetch(
      "/api/manifests/"+manifestNumber
    );

    const data=await response.json();

    setManifest(data);

  }

  const handlePrint=useReactToPrint({
    contentRef:printRef,
    documentTitle:manifest?.manifestNumber,
  });

  if(!manifest){

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

<PrintableManifest
manifest={manifest}
/>

</div>

</div>

);

}
