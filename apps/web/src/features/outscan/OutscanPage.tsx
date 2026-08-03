"use client";

import { useState } from "react";

import OutscanSearch from "./components/OutscanSearch";
import OutscanShipmentCard from "./components/OutscanShipmentCard";

export default function OutscanPage() {

  const [shipment,setShipment]=useState<any>(null);

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Outscan
        </h1>

        <p className="mt-2 text-slate-500">
          Dispatch shipment from warehouse.
        </p>

      </div>

      <OutscanSearch
        onFound={setShipment}
      />

      {shipment && (
        <OutscanShipmentCard
          shipment={shipment}
        />
      )}

    </div>

  );

}
