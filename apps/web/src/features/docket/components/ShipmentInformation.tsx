"use client";

import { useEffect, useState } from "react";
import StationSelect from "@/components/master/StationSelect";
import { generateTrackingNumber } from "@/lib/docket/generateTrackingNumber";

export default function ShipmentInformation() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [docketNumber, setDocketNumber] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (
      mode === "auto" &&
      origin &&
      destination
    ) {
      setDocketNumber(
        generateTrackingNumber(
          origin,
          destination,
          1
        )
      );
    } else if (mode === "auto") {
      setDocketNumber("");
    }
  }, [
    mode,
    origin,
    destination,
  ]);

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Shipment Information
      </h2>

      <div className="mb-8 flex gap-8">

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "auto"}
            onChange={() => setMode("auto")}
          />
          Auto Generate
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
          Manual
        </label>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <input
          className="rounded-lg border p-3"
          placeholder="Booking Date"
          type="date"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Docket Number"
          value={docketNumber}
          readOnly={mode === "auto"}
          onChange={(e) => setDocketNumber(e.target.value)}
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Customer Reference Number"
        />

        <StationSelect
          label="Origin"
          value={origin}
          onChange={setOrigin}
        />

        <StationSelect
          label="Destination"
          value={destination}
          onChange={setDestination}
        />

        <select className="rounded-lg border p-3">
          <option>Service Type</option>
          <option>Air</option>
          <option>Surface</option>
          <option>Express</option>
        </select>

        <select className="rounded-lg border p-3">
          <option>Priority</option>
          <option>Normal</option>
          <option>High</option>
          <option>Critical</option>
        </select>

      </div>

    </section>
  );
}
