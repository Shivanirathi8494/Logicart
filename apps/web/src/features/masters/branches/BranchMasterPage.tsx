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

<div className="space-y-5 sm:space-y-8">

<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

<div>

<h1 className="text-2xl font-bold text-[#0b2340] sm:text-3xl">

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
className="min-h-11 w-full rounded-lg bg-[#1877F2] px-5 py-3 font-semibold text-white sm:w-auto"
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

{/* MOBILE */}
<div className="divide-y md:hidden">

{filtered.map(branch=>(

<div
key={branch.id}
className="p-4"
>

<div className="flex items-start justify-between gap-3">

<div>
<div className="text-xs text-slate-400">
Branch
</div>

<div className="mt-1 font-bold text-[#0b2340]">
{branch.code} — {branch.name}
</div>
</div>

<span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
{branch.status}
</span>

</div>

<div className="mt-4 space-y-3 text-sm">

<div>
<div className="text-xs text-slate-400">Address</div>
<div className="mt-1">{branch.address}</div>
</div>

<div className="grid grid-cols-2 gap-4">

<div>
<div className="text-xs text-slate-400">Phone</div>
<div className="mt-1 break-all">{branch.phone}</div>
</div>

<div>
<div className="text-xs text-slate-400">Email</div>
<div className="mt-1 break-all">{branch.email}</div>
</div>

</div>

</div>

<div className="mt-4 flex gap-2">

<button
onClick={()=>{
setSelectedBranch(branch);
setOpen(true);
}}
className="min-h-11 flex-1 rounded-lg border px-3 py-2 font-semibold"
>
Edit
</button>

<button
onClick={()=>deleteBranch(branch)}
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
