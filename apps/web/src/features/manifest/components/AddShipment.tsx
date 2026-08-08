"use client";

import { useState } from "react";

type Props = {
  onAdd: (awb: string) => void;
};

export default function AddShipment({
  onAdd,
}: Props) {

  const [awb, setAwb] = useState("");

  function addShipment() {

    const value = awb.trim().toUpperCase();

    if (!value) {
      return;
    }

    onAdd(value);

    setAwb("");

    setTimeout(() => {
      document.getElementById("awb-input")?.focus();
    }, 0);

  }

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Add Shipments
      </h2>

      <div className="flex gap-4">

        <input
          id="awb-input"
          placeholder="AWB Number"
          value={awb}
          className="flex-1 rounded-lg border p-3 uppercase"
          onChange={(e)=>setAwb(e.target.value.toUpperCase())}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
              e.preventDefault();
              addShipment();
            }
          }}
        />

        <button
          onClick={addShipment}
          className="rounded-lg bg-[#1877F2] px-8 text-white"
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
