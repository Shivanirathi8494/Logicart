"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ManifestHeader from "./components/ManifestHeader";
import ShipmentSearch from "./components/ShipmentSearch";
import ShipmentTable from "./components/ShipmentTable";
import ManifestSummary from "./components/ManifestSummary";

export default function ManifestPage() {

  const router = useRouter();

  const [shipments,setShipments]=useState<any[]>([]);

  function addShipment(shipment:any){

    if(
      shipments.find(
        s=>s.id===shipment.id
      )
    ){
      alert("Shipment already added");
      return;
    }

    setShipments([
      ...shipments,
      shipment,
    ]);

  }

  return(

    <div className="space-y-8">

      <ManifestHeader/>

      <ShipmentSearch
        onAdd={addShipment}
      />

      <ShipmentTable
        shipments={shipments}
      />

      <ManifestSummary
        shipments={shipments}
        onCreated={(manifestNumber:string)=>{
          router.push("/portal/warehouse/manifest/"+manifestNumber);
        }}
      />

    </div>

  );

}
