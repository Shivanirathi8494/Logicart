"use client";

import { useState } from "react";

export default function StatusUpdateForm({shipment}:any){

const [status,setStatus]=useState(shipment.status);

const [remarks,setRemarks]=useState("");

async function updateStatus(){

const response=await fetch(

"/api/dockets/"+shipment.trackingNumber+"/status",

{

method:"PATCH",

headers:{

"Content-Type":"application/json",

},

body:JSON.stringify({

status,

remarks,

}),

}

);

if(response.ok){

alert("Status Updated");

location.reload();

}else{

alert("Unable to update");

}

}

return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<h2 className="mb-6 text-xl font-semibold">

Update Status

</h2>

<div className="grid gap-6 md:grid-cols-2">

<select

className="rounded-lg border p-3"

value={status}

onChange={(e)=>setStatus(e.target.value)}

>

<option value="BOOKED">BOOKED</option>

<option value="INSCAN">INSCAN</option>

<option value="MANIFESTED">MANIFESTED</option>

<option value="OUTSCAN">OUTSCAN</option>

<option value="DELIVERED">DELIVERED</option>

<option value="CANCELLED">CANCELLED</option>

</select>

<textarea

rows={4}

placeholder="Remarks"

className="rounded-lg border p-3"

value={remarks}

onChange={(e)=>setRemarks(e.target.value)}

>

</textarea>

</div>

<div className="mt-6">

<button

onClick={updateStatus}

className="rounded-lg bg-[#1877F2] px-6 py-3 text-white"

>

Update Status

</button>

</div>

</section>

);

}
