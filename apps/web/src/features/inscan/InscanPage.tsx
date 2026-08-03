"use client";

import { useState } from "react";
import InscanSearch from "./components/InscanSearch";
import InscanShipmentCard from "./components/InscanShipmentCard";

export default function InscanPage() {

  const [shipment, setShipment] = useState<any>(null);

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Inscan
        </h1>

        <p className="mt-2 text-slate-500">
          Scan or search a shipment received at this warehouse.
        </p>

      </div>

      <InscanSearch
        onFound={setShipment}
      />

      {shipment && (
        <InscanShipmentCard
          shipment={shipment}
        />
      )}

    </div>

  );

}
