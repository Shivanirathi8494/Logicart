"use client";

import { useState } from "react";
import BranchDialog from "./components/BranchDialog";

const branches = [
  {
    id: 1,
    code: "BLR",
    name: "Bangalore",
    address: "Electronic City",
    phone: "08012345678",
    email: "blr@logicarts.com",
    status: "ACTIVE",
  },
  {
    id: 2,
    code: "DEL",
    name: "Delhi",
    address: "Okhla",
    phone: "01198765432",
    email: "del@logicarts.com",
    status: "ACTIVE",
  },
];

export default function BranchMasterPage() {

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const filtered = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(search.toLowerCase()) ||
      branch.code.toLowerCase().includes(search.toLowerCase())
  );

  function deleteBranch(branch:any){

    const ok = confirm(
      `Delete branch "${branch.name}"?`
    );

    if(!ok) return;

    alert("Delete will be connected to backend later.");

  }

  return (

<div className="space-y-8">

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">

Branch Master

</h1>

<p className="mt-2 text-slate-500">

Manage company branches.

</p>

</div>

<button
onClick={()=>{
setSelectedBranch(null);
setOpen(true);
}}
className="rounded-lg bg-blue-600 px-5 py-3 text-white"
>

+ Add Branch

</button>

</div>

<input

value={search}

onChange={e=>setSearch(e.target.value)}

placeholder="Search branch..."

className="w-full rounded-lg border p-3"

/>

<div className="overflow-hidden rounded-xl border bg-white shadow-sm">

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">Code</th>

<th className="p-4 text-left">Branch</th>

<th className="p-4 text-left">Address</th>

<th className="p-4 text-left">Phone</th>

<th className="p-4 text-left">Email</th>

<th className="p-4 text-left">Status</th>

<th className="p-4 text-center">Actions</th>

</tr>

</thead>

<tbody>

{filtered.map(branch=>(

<tr
key={branch.id}
className="border-t hover:bg-slate-50"
>

<td className="p-4">

{branch.code}

</td>

<td className="p-4">

{branch.name}

</td>

<td className="p-4">

{branch.address}

</td>

<td className="p-4">

{branch.phone}

</td>

<td className="p-4">

{branch.email}

</td>

<td className="p-4">

<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

{branch.status}

</span>

</td>

<td className="space-x-2 p-4 text-center">

<button
onClick={()=>{
setSelectedBranch(branch);
setOpen(true);
}}
className="rounded border px-3 py-1"
>

Edit

</button>

<button
onClick={()=>deleteBranch(branch)}
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

Showing {filtered.length} branch(es)

</div>

<BranchDialog
open={open}
branch={selectedBranch}
onClose={()=>{
setOpen(false);
setSelectedBranch(null);
}}
/>

</div>

);

}
