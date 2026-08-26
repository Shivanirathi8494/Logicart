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

    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

      <label className="mb-2 block text-sm font-medium">

        Loading Tally Number

      </label>

      <div className="flex flex-col gap-3 sm:flex-row">

        <input
          className="min-h-11 w-full flex-1 rounded-lg border p-3 text-base"
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
          className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white disabled:opacity-50 sm:w-auto sm:px-8"
        >

          {loading ? "Searching..." : "Search"}

        </button>

      </div>

    </section>

  );

}
