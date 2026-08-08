"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackingWidget() {

  const router = useRouter();

  const [trackingNumber, setTrackingNumber] = useState("");

  function track() {

    if (!trackingNumber.trim()) {

      alert("Please enter a AWB Number.");

      return;

    }

    router.push(
      "/tracking?trackingNumber=" +
      encodeURIComponent(trackingNumber)
    );

  }

  return (

    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-center text-3xl font-bold">

        Track Your Shipment

      </h2>

      <div className="flex flex-col gap-4 md:flex-row">

        <input

          value={trackingNumber}

          onChange={(e)=>
            setTrackingNumber(
              e.target.value.toUpperCase()
            )
          }

          placeholder="Enter AWB Number"

          className="flex-1 rounded-lg border border-slate-300 p-4"

          onKeyDown={(e)=>{

            if(e.key==="Enter"){

              track();

            }

          }}

        />

        <button

          onClick={track}

          className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"

        >

          Track Now

        </button>

      </div>

    </div>

  );

}
