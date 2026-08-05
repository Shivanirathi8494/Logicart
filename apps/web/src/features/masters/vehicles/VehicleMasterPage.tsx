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

<div className="space-y-8">

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">

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

className="rounded-lg bg-blue-600 px-5 py-3 text-white"

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
