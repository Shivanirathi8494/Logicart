"use client";

import { useState } from "react";
import CustomerDialog from "./components/CustomerDialog";

const customers = [

  {
    id:1,
    customerCode:"CUST001",
    name:"ABC Traders",
    contactPerson:"Rahul Sharma",
    gst:"29ABCDE1234F1Z5",
    phone:"9876543210",
    email:"abc@traders.com",
    status:"ACTIVE",
  },

  {
    id:2,
    customerCode:"CUST002",
    name:"XYZ Electronics",
    contactPerson:"Amit Verma",
    gst:"27XYZAB1234G1Z2",
    phone:"9988776655",
    email:"sales@xyz.com",
    status:"ACTIVE",
  },

];

export default function CustomerMasterPage(){

const [search,setSearch]=useState("");

const [open,setOpen]=useState(false);

const [selectedCustomer,setSelectedCustomer]=useState<any>(null);

const filtered=customers.filter(customer=>

customer.name.toLowerCase().includes(search.toLowerCase()) ||

customer.customerCode.toLowerCase().includes(search.toLowerCase())

);

function deleteCustomer(customer:any){

if(confirm(`Delete ${customer.name}?`)){

alert("Backend will be connected later.");

}

}

return(

<div className="space-y-5 sm:space-y-8">

<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

<div>

<h1 className="text-2xl font-bold text-[#0b2340] sm:text-3xl">

Customer Master

</h1>

<p className="mt-2 text-slate-500">

Manage customers.

</p>

</div>

<button

onClick={()=>{

setSelectedCustomer(null);

setOpen(true);

}}

className="min-h-11 w-full rounded-lg bg-[#1877F2] px-5 py-3 font-semibold text-white sm:w-auto"

>

+ Add Customer

</button>

</div>

<input

value={search}

onChange={e=>setSearch(e.target.value)}

placeholder="Search customer..."

className="w-full rounded-lg border p-3"

/>

<div className="overflow-hidden rounded-xl border bg-white shadow-sm">

{/* MOBILE */}
<div className="divide-y md:hidden">

{filtered.map(customer=>(

<div
key={customer.id}
className="p-4"
>

<div className="flex items-start justify-between gap-3">

<div className="min-w-0">

<div className="text-xs text-slate-400">
Customer
</div>

<div className="mt-1 break-words font-bold text-[#0b2340]">
{customer.name}
</div>

</div>

<span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
{customer.status}
</span>

</div>

<div className="mt-4 grid grid-cols-2 gap-4 text-sm">

<div>
<div className="text-xs text-slate-400">Code</div>
<div className="mt-1 font-medium">
{customer.customerCode}
</div>
</div>

<div>
<div className="text-xs text-slate-400">Phone</div>
<div className="mt-1 break-all">
{customer.phone}
</div>
</div>

</div>

<div className="mt-4 flex gap-2">

<button
onClick={()=>{
setSelectedCustomer(customer);
setOpen(true);
}}
className="min-h-11 flex-1 rounded-lg border px-3 py-2 font-semibold"
>
Edit
</button>

<button
onClick={()=>deleteCustomer(customer)}
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

<th className="p-4 text-left">Code</th>

<th className="p-4 text-left">Customer</th>

<th className="p-4 text-left">Contact</th>

<th className="p-4 text-left">GST</th>

<th className="p-4 text-left">Phone</th>

<th className="p-4 text-left">Status</th>

<th className="p-4 text-center">Actions</th>

</tr>

</thead>

<tbody>

{filtered.map(customer=>(

<tr
key={customer.id}
className="border-t hover:bg-slate-50"
>

<td className="p-4">

{customer.customerCode}

</td>

<td className="p-4">

{customer.name}

</td>

<td className="p-4">

{customer.contactPerson}

</td>

<td className="p-4">

{customer.gst}

</td>

<td className="p-4">

{customer.phone}

</td>

<td className="p-4">

<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

{customer.status}

</span>

</td>

<td className="space-x-2 p-4 text-center">

<button

onClick={()=>{

setSelectedCustomer(customer);

setOpen(true);

}}

className="rounded border px-3 py-1"

>

Edit

</button>

<button

onClick={()=>deleteCustomer(customer)}

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

Showing {filtered.length} customer(s)

</div>

<CustomerDialog

open={open}

customer={selectedCustomer}

onClose={()=>{

setOpen(false);

setSelectedCustomer(null);

}}

/>

</div>

);

}
