"use client";

import { useEffect, useState } from "react";

import SearchFilters from "./components/SearchFilters";
import SearchResults from "./components/SearchResults";

import ShipmentCard from "@/features/update-status/components/ShipmentCard";
import StatusUpdateForm from "@/features/update-status/components/StatusUpdateForm";
import StatusHistory from "@/features/update-status/components/StatusHistory";

export default function SearchDocketPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function search(filters: { tracking: string }) {
    const tracking = filters.tracking.trim();

    if (tracking) {
      setHasSearched(true);
    }

    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (tracking) {
        params.append("tracking", tracking);
      }

      const response = await fetch(
        "/api/dockets?" + params.toString()
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      setResults(data);

      if (tracking && data.length > 0) {
        setShipment(data[0]);
      } else if (tracking) {
        setShipment(null);
      } else {
        setShipment(null);
      }
    } catch (error) {
      console.error("Docket search failed:", error);
      setResults([]);
      setShipment(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search({ tracking: "" });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Docket Management
        </h1>

        <p className="mt-2 text-slate-500">
          Search by AWB number, view available dockets, and update shipment status.
        </p>
      </div>

      <SearchFilters onSearch={search} />

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Available Dockets
        </h2>

        <SearchResults
          loading={loading}
          rows={results}
          onSelect={setShipment}
          hasSearched={hasSearched}
        />
      </div>

      {shipment && (
        <div className="space-y-8">
          <ShipmentCard shipment={shipment} />

          <StatusUpdateForm shipment={shipment} />

          <StatusHistory shipment={shipment} />
        </div>
      )}
    </div>
  );
}
