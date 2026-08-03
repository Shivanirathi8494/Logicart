"use client";

import { useState } from "react";

export default function SearchFilters({
  onSearch,
}: any) {

  const [manifestNumber, setManifestNumber] = useState("");

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="grid gap-4 md:grid-cols-2">

        <input
          className="rounded-lg border p-3"
          placeholder="Manifest Number"
          value={manifestNumber}
          onChange={(e)=>setManifestNumber(e.target.value)}
        />

        <button
          onClick={()=>
            onSearch({
              manifestNumber,
            })
          }
          className="rounded-lg bg-blue-600 p-3 text-white"
        >
          Search
        </button>

      </div>

    </section>

  );

}
