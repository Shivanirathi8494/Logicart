"use client";

import { useState } from "react";

import ChallanHeader from "./components/ChallanHeader";
import ShipmentSearch from "./components/ShipmentSearch";
import ShipmentTable from "./components/ShipmentTable";
import ChallanSummary from "./components/ChallanSummary";

export default function DeliveryChallanPage() {

  const [shipments,setShipments]=useState<any[]>([]);

  function addShipment(shipment:any){

    if(shipments.find(s=>s.id===shipment.id)){
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

<ChallanHeader/>

<ShipmentSearch
onAdd={addShipment}
/>

<ShipmentTable
shipments={shipments}
/>

<ChallanSummary
shipments={shipments}
/>

</div>

);

}
