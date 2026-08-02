"use client";

import { useMemo, useState } from "react";
import { airports } from "@/lib/master/airports";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function StationSelect({
  label,
  value,
  onChange,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return airports.filter((station) => {
      const text =
        `${station.code} ${station.city} ${station.airport}`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <div className="space-y-2">

      <label className="block text-sm font-medium">
        {label}
      </label>

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Search airport..."
        value={search || value}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange("");
        }}
      />

      {search && (
        <div className="max-h-60 overflow-auto rounded-lg border bg-white shadow">

          {filtered.map((station) => (
            <button
              key={station.code}
              type="button"
              onClick={() => {
                onChange(station.code);
                setSearch("");
              }}
              className="block w-full px-4 py-3 text-left hover:bg-slate-100"
            >
              <div className="font-semibold">
                {station.code} - {station.city}
              </div>

              <div className="text-sm text-slate-500">
                {station.airport}
              </div>
            </button>
          ))}

        </div>
      )}

    </div>
  );
}
