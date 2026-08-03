"use client";

import { useState } from "react";

import SearchShipment from "./components/SearchShipment";
import ShipmentCard from "./components/ShipmentCard";
import StatusUpdateForm from "./components/StatusUpdateForm";
import StatusHistory from "./components/StatusHistory";

export default function UpdateStatusPage() {

  const [shipment,setShipment]=useState<any>(null);

  return(

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Update Shipment Status

        </h1>

        <p className="mt-2 text-slate-500">

          Search shipment and update current status.

        </p>

      </div>

      <SearchShipment
        onFound={setShipment}
      />

      {shipment && (

        <>

          <ShipmentCard shipment={shipment}/>

          <StatusUpdateForm shipment={shipment}/>

          <StatusHistory shipment={shipment}/>

        </>

      )}

    </div>

  );

}
