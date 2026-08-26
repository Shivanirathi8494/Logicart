"use client";

import { useState } from "react";

type Props = {
  onAdd: (shipment: any) => void;
};

export default function ShipmentSearch({
  onAdd,
}: Props) {

  const [awb, setAwb] = useState("");

  async function search() {

    const value = awb.trim().toUpperCase();

    if (!value) return;

    const response = await fetch(
      "/api/dockets/" + value
    );

    if (!response.ok) {

      alert("AWB not found");

      return;

    }

    const shipment = await response.json();

    if (shipment.status !== "BOOKED") {

      alert(
        "Only BOOKED shipments can be added to a manifest."
      );

      return;

    }

    onAdd(shipment);

    setAwb("");

    setTimeout(() => {

      (
        document.getElementById(
          "awb-input"
        ) as HTMLInputElement
      )?.focus();

    },0);

  }

  return (

    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

      <h2 className="mb-4 text-lg font-semibold text-[#0b2340] sm:mb-5 sm:text-xl">
        Add Shipments
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">

        <input

          id="awb-input"

          placeholder="AWB Number"

          value={awb}

          className="min-h-11 w-full flex-1 rounded-lg border p-3 text-base uppercase"

          onChange={(e)=>
            setAwb(
              e.target.value.toUpperCase()
            )
          }

          onKeyDown={(e)=>{

            if(e.key==="Enter"){

              e.preventDefault();

              search();

            }

          }}

        />

        <button
          onClick={search}
          className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white sm:w-auto sm:px-8"
        >

          Add Shipment

        </button>

      </div>

      <p className="mt-3 text-sm text-slate-500">

        Scan or enter an AWB number and press Enter.

      </p>

    </section>

  );

}
