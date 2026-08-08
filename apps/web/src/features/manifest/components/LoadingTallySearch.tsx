"use client";

import { useState } from "react";

export default function LoadingTallySearch({
  onFound,
}: any) {

  const [loadingTallyNumber, setLoadingTallyNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function search() {

    if (!loadingTallyNumber.trim()) {
      alert("Please enter Loading Tally Number.");
      return;
    }

    setLoading(true);

    const response = await fetch(
      "/api/loading-tallies/" + loadingTallyNumber
    );

    if (response.ok) {

      onFound(await response.json());

    } else {

      alert("Loading Tally not found.");

    }

    setLoading(false);

  }

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <label className="mb-2 block text-sm font-medium">

        Loading Tally Number

      </label>

      <div className="flex gap-3">

        <input
          className="flex-1 rounded-lg border p-3"
          placeholder="LT-MAA-260807-000001"
          value={loadingTallyNumber}
          onChange={(e) => setLoadingTallyNumber(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
        />

        <button
          onClick={search}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white disabled:opacity-50"
        >

          {loading ? "Searching..." : "Search"}

        </button>

      </div>

    </section>

  );

}
