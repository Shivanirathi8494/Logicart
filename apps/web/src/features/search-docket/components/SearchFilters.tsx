"use client";

import { useState } from "react";

type Props = {
  onSearch: (filters: {
    tracking: string;
    status: string;
  }) => void;
};

export default function SearchFilters({
  onSearch,
}: Props) {

  const [tracking, setTracking] = useState("");
  const [status, setStatus] = useState("");

  function clear() {

    setTracking("");
    setStatus("");

    onSearch({
      tracking: "",
      status: "",
    });

  }

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="grid gap-5 lg:grid-cols-2">

        <input
          placeholder="AWB Number"
          className="rounded-lg border p-3"
          value={tracking}
          onChange={(e)=>setTracking(e.target.value)}
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
