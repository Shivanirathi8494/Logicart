"use client";

import { useState } from "react";

type Props = {
  onSearch: (filters: {
    tracking: string;
  }) => void;
};

export default function SearchFilters({
  onSearch,
}: Props) {
  const [tracking, setTracking] = useState("");

  function clear() {
    setTracking("");
    onSearch({
      tracking: "",
    });
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex gap-4">
        <input
          placeholder="Enter AWB Number"
          className="flex-1 rounded-lg border p-3"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch({ tracking });
            }
          }}
        />

        <button
          onClick={() => onSearch({ tracking })}
          className="rounded-lg bg-[#1877F2] px-6 py-3 text-white"
        >
          Search
        </button>

        <button
          onClick={clear}
          className="rounded-lg border px-6 py-3"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
