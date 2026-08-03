"use client";

import { useEffect, useState } from "react";

import SearchFilters from "./components/SearchFilters";
import SearchResults from "./components/SearchResults";

export default function SearchDocketPage() {

  const [results,setResults]=useState([]);

  const [loading,setLoading]=useState(false);

  async function search(filters:any){

    setLoading(true);

    const params=new URLSearchParams();

    if(filters.tracking)
      params.append("tracking",filters.tracking);

    if(filters.mobile)
      params.append("mobile",filters.mobile);

    if(filters.origin)
      params.append("origin",filters.origin);

    if(filters.destination)
      params.append("destination",filters.destination);

    if(filters.status)
      params.append("status",filters.status);

    const url="/api/dockets?"+params.toString();

console.log("Calling URL:",url);

console.log("URL:",url);
const response=await fetch(url);
console.log("STATUS:",response.status);
if(!response.ok){const txt=await response.text();console.log("BODY:",txt);throw new Error(txt);}

console.log("Response:",response.status);

    const data=await response.json();

    setResults(data);

    setLoading(false);

  }

  useEffect(() => {
    search({});
  }, []);

  return(

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Search Docket
        </h1>

        <p className="text-slate-500 mt-2">
          Search shipments stored in database.
        </p>

      </div>

      <SearchFilters
        onSearch={search}
      />

      <SearchResults
        loading={loading}
        rows={results}
      />

    </div>

  );

}
