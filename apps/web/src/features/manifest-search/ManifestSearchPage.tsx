"use client";

import { useState } from "react";
import SearchFilters from "./components/SearchFilters";
import SearchResults from "./components/SearchResults";

export default function ManifestSearchPage(){

const [rows,setRows]=useState([]);

async function search(filters:any){

const response=await fetch(
"/api/manifests?manifestNumber="+filters.manifestNumber
);

const data=await response.json();

setRows(data);

}

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">

Search Manifest

</h1>

<SearchFilters
onSearch={search}
/>

<SearchResults
rows={rows}
/>

</div>

);

}
