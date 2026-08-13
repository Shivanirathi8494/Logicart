"use client";

import { useEffect, useState } from "react";

type Airline = {
  id: string;
  name: string;
  iataDesignator: string;
  icaoCode: string;
  iataPrefix: string | null;
  active: boolean;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AirlineSelect({
  value,
  onChange,
}: Props) {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAirlines() {
      try {
        const response = await fetch("/api/airlines");

        if (!response.ok) {
          throw new Error("Unable to load airlines");
        }

        const data = await response.json();
        setAirlines(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAirlines();
  }, []);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Airline
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full rounded-lg border p-3"
      >
        <option value="">
          {loading ? "Loading airlines..." : "Select Airline"}
        </option>

        {airlines.map((airline) => (
          <option
            key={airline.id}
            value={airline.id}
          >
            {airline.name} ({airline.iataDesignator})
          </option>
        ))}
      </select>
    </div>
  );
}
