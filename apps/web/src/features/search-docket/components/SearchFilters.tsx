"use client";

import { useState } from "react";
import StationSelect from "@/components/master/StationSelect";

type Props = {
  onSearch: (filters: {
    tracking: string;
    mobile: string;
    origin: string;
    destination: string;
    status: string;
  }) => void;
};

export default function SearchFilters({ onSearch }: Props) {

  const [tracking, setTracking] = useState("");
  const [mobile, setMobile] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");

  function clear() {
    setTracking("");
    setMobile("");
    setOrigin("");
    setDestination("");
    setStatus("");
  }

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="grid gap-5 lg:grid-cols-5">

        <input
          placeholder="Tracking Number"
          className="rounded-lg border p-3"
          value={tracking}
          onChange={(e)=>setTracking(e.target.value)}
        />

        <input
          placeholder="Mobile Number"
          className="rounded-lg border p-3"
          value={mobile}
          onChange={(e)=>setMobile(e.target.value)}
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

        <select
          className="rounded-lg border p-3"
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="BOOKED">Booked</option>
          <option value="INSCAN">Inscan</option>
          <option value="MANIFESTED">Manifested</option>
          <option value="OUTSCAN">Outscan</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

      </div>

      <div className="mt-6 flex justify-end gap-4">

        <button
          onClick={clear}
          className="rounded-lg border px-6 py-3"
        >
          Reset
        </button>

        <button
          onClick={() =>
            onSearch({
              tracking,
              mobile,
              origin,
              destination,
              status,
            })
          }
          className="rounded-lg bg-[#1877F2] px-6 py-3 text-white"
        >
          Search
        </button>

      </div>

    </section>

  );

}
