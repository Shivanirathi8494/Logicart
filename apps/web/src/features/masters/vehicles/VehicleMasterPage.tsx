"use client";

import { useState } from "react";
import VehicleDialog from "./components/VehicleDialog";

const vehicles = [

  {
    id:1,
    vehicleNumber:"KA01AB1234",
    vehicleType:"Truck",
    capacity:"10 Ton",
    driverName:"Ramesh Kumar",
    driverPhone:"9876543210",
    status:"ACTIVE",
  },

  {
    id:2,
    vehicleNumber:"MH12CD5678",
    vehicleType:"Mini Truck",
    capacity:"5 Ton",
    driverName:"Suresh Patel",
    driverPhone:"9988776655",
    status:"ACTIVE",
  },

];

export default function VehicleMasterPage(){

const [search,setSearch]=useState("");

const [open,setOpen]=useState(false);

const [selectedVehicle,setSelectedVehicle]=useState<any>(null);

const filtered=vehicles.filter(vehicle=>

vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||

vehicle.driverName.toLowerCase().includes(search.toLowerCase())

);

function deleteVehicle(vehicle:any){

if(confirm(`Delete ${vehicle.vehicleNumber}?`)){

alert("Backend will be connected later.");

}

}

return(

<div className="space-y-5 sm:space-y-8">

<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

<div>

<h1 className="text-2xl font-bold text-[#0b2340] sm:text-3xl">

Vehicle Master

</h1>

<p className="mt-2 text-slate-500">

Manage transportation vehicles.

</p>

</div>

<button

onClick={()=>{

setSelectedVehicle(null);

setOpen(true);

}}

className="min-h-11 w-full rounded-lg bg-[#1877F2] px-5 py-3 font-semibold text-white sm:w-auto"

>

+ Add Vehicle

</button>

</div>

<input

value={search}

onChange={e=>setSearch(e.target.value)}

placeholder="Search vehicle..."

className="w-full rounded-lg border p-3"

/>

<div className="overflow-hidden rounded-xl border bg-white shadow-sm">

{/* MOBILE */}
<div className="divide-y md:hidden">

{filtered.map(vehicle=>(

<div
key={vehicle.id}
className="p-4"
>

<div className="flex items-start justify-between gap-3">

<div>
<div className="text-xs text-slate-400">
Vehicle
</div>

<div className="mt-1 font-bold text-[#0b2340]">
{vehicle.vehicleNumber}
</div>
</div>

<span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
{vehicle.status}
</span>

</div>

<div className="mt-4 grid grid-cols-2 gap-4 text-sm">

<div>
<div className="text-xs text-slate-400">Type</div>
<div className="mt-1 font-medium">{vehicle.vehicleType}</div>
</div>

<div>
<div className="text-xs text-slate-400">Capacity</div>
<div className="mt-1 font-medium">{vehicle.capacity}</div>
</div>

<div>
<div className="text-xs text-slate-400">Driver</div>
<div className="mt-1 font-medium">{vehicle.driverName}</div>
</div>

<div>
<div className="text-xs text-slate-400">Phone</div>
<div className="mt-1 font-medium">{vehicle.driverPhone}</div>
</div>

</div>

<div className="mt-4 flex gap-2">

<button
onClick={()=>{
setSelectedVehicle(vehicle);
setOpen(true);
}}
className="min-h-11 flex-1 rounded-lg border px-3 py-2 font-semibold"
>
Edit
</button>

<button
onClick={()=>deleteVehicle(vehicle)}
className="min-h-11 flex-1 rounded-lg border border-red-500 px-3 py-2 font-semibold text-red-600"
>
Delete
</button>

</div>

</div>

))}

</div>

{/* DESKTOP */}
<div className="hidden overflow-x-auto md:block">

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">Vehicle No.</th>

<th className="p-4 text-left">Type</th>

<th className="p-4 text-left">Capacity</th>

<th className="p-4 text-left">Driver</th>

<th className="p-4 text-left">Phone</th>

<th className="p-4 text-left">Status</th>

<th className="p-4 text-center">Actions</th>

</tr>

</thead>

<tbody>

{filtered.map(vehicle=>(

<tr
key={vehicle.id}
className="border-t hover:bg-slate-50"
>

<td className="p-4">{vehicle.vehicleNumber}</td>

<td className="p-4">{vehicle.vehicleType}</td>

<td className="p-4">{vehicle.capacity}</td>

<td className="p-4">{vehicle.driverName}</td>

<td className="p-4">{vehicle.driverPhone}</td>

<td className="p-4">

<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

{vehicle.status}

</span>

</td>

<td className="space-x-2 p-4 text-center">

<button

onClick={()=>{

setSelectedVehicle(vehicle);

setOpen(true);

}}

className="rounded border px-3 py-1"

>

Edit

</button>

<button

onClick={()=>deleteVehicle(vehicle)}

className="rounded bg-red-600 px-3 py-1 text-white"

>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

<div className="text-sm text-slate-500">

Showing {filtered.length} vehicle(s)

</div>

<VehicleDialog

open={open}

vehicle={selectedVehicle}

onClose={()=>{

setOpen(false);

setSelectedVehicle(null);

}}

/>

</div>

);

}
