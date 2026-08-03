"use client";

import { useEffect } from "react";

import StationSelect from "@/components/master/StationSelect";
import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

export default function ShipmentInformation({
  shipment,
  setShipment,
}: Props) {

  
  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">

        Shipment Information

      </h2>

      <div className="grid gap-6 lg:grid-cols-3">

        <input
          type="date"
          className="rounded-lg border p-3"
          value={shipment.bookingDate}
          onChange={(e)=>
            setShipment((prev)=>({
              ...prev,
              bookingDate:e.target.value,
            }))
          }
        />

        <input
          readOnly
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.trackingNumber}
          placeholder="Tracking Number"
        />

        <input
          placeholder="Customer Reference Number"
          className="rounded-lg border p-3"
        />

        <StationSelect
          label="Origin"
          value={shipment.origin}
          onChange={(value)=>
            setShipment((prev)=>({
              ...prev,
              origin:value,
            }))
          }
        />

        <StationSelect
          label="Destination"
          value={shipment.destination}
          onChange={(value)=>
            setShipment((prev)=>({
              ...prev,
              destination:value,
            }))
          }
        />

        <select
          className="rounded-lg border p-3"
        >
          <option>Air</option>
        </select>

      </div>

    </section>

  );

}
