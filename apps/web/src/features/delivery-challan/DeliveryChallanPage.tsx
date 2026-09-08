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

    /*
     * A Delivery Challan cannot mix
     * Door-to-Door and Airport/Warehouse shipments.
     */
    if (
      shipments.length > 0 &&
      shipments[0].deliveryType !== shipment.deliveryType
    ) {
      const currentMode =
        shipments[0].deliveryType === "AIRPORT_DELIVERY"
          ? "Airport / Warehouse Delivery"
          : "Door to Door";

      alert(
        `This challan already contains ${currentMode} shipments. ` +
        "Please create a separate Delivery Challan for the other delivery mode."
      );

      return;
    }

    setShipments([
      ...shipments,
      shipment,
    ]);

  }

  return(

<div className="space-y-5 sm:space-y-8">

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
