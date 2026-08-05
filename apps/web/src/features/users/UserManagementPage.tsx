"use client";

import { useState } from "react";
import UserDialog from "./components/UserDialog";

const users = [

  {
    id:1,
    name:"Admin User",
    username:"admin",
    email:"admin@logicarts.com",
    phone:"9876543210",
    role:"Administrator",
    status:"ACTIVE",
  },

  {
    id:2,
    name:"Warehouse Executive",
    username:"warehouse",
    email:"warehouse@logicarts.com",
    phone:"9988776655",
    role:"Warehouse",
    status:"ACTIVE",
  },

  {
    id:3,
    name:"Booking Executive",
    username:"booking",
    email:"booking@logicarts.com",
    phone:"9999999999",
    role:"Booking",
    status:"ACTIVE",
  },

];

export default function UserManagementPage(){

const [search,setSearch]=useState("");

const [open,setOpen]=useState(false);

const [selectedUser,setSelectedUser]=useState<any>(null);

const filtered=users.filter(user=>

user.name.toLowerCase().includes(search.toLowerCase()) ||

user.username.toLowerCase().includes(search.toLowerCase())

);

function deleteUser(user:any){

if(confirm(`Delete ${user.name}?`)){

alert("Backend will be connected later.");

}

}

return(

<div className="space-y-8">

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">

User Management

</h1>

<p className="mt-2 text-slate-500">

Manage application users and permissions.

</p>

</div>

<button

onClick={()=>{

setSelectedUser(null);

setOpen(true);

}}

className="rounded-lg bg-blue-600 px-5 py-3 text-white"

>

+ Add User

</button>

</div>

<input

value={search}

onChange={e=>setSearch(e.target.value)}

placeholder="Search user..."

className="w-full rounded-lg border p-3"

/>

<div className="overflow-hidden rounded-xl border bg-white shadow-sm">

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">Name</th>

<th className="p-4 text-left">Username</th>

<th className="p-4 text-left">Email</th>

<th className="p-4 text-left">Phone</th>

<th className="p-4 text-left">Role</th>

<th className="p-4 text-left">Status</th>

<th className="p-4 text-center">Actions</th>

</tr>

</thead>

<tbody>

{filtered.map(user=>(

<tr
key={user.id}
className="border-t hover:bg-slate-50"
>

<td className="p-4">{user.name}</td>

<td className="p-4">{user.username}</td>

<td className="p-4">{user.email}</td>

<td className="p-4">{user.phone}</td>

<td className="p-4">{user.role}</td>

<td className="p-4">

<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

{user.status}

</span>

</td>

<td className="space-x-2 p-4 text-center">

<button

onClick={()=>{

setSelectedUser(user);

setOpen(true);

}}

className="rounded border px-3 py-1"

>

Edit

</button>

<button

onClick={()=>deleteUser(user)}

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

Showing {filtered.length} user(s)

</div>

<UserDialog

open={open}

user={selectedUser}

onClose={()=>{

setOpen(false);

setSelectedUser(null);

}}

/>

</div>

);

}
