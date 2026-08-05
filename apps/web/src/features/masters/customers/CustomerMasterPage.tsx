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

<div className="space-y-8">

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">

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

className="rounded-lg bg-blue-600 px-5 py-3 text-white"

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
