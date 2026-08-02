"use client";

import Link from "next/link";

const menu = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "Create Docket", href: "/portal/operations/create-docket" },
  { label: "Search Docket", href: "/portal/operations/search-docket" },
  { label: "Update Status", href: "/portal/operations/update-status" },
  { label: "Inscan", href: "/portal/warehouse/inscan" },
  { label: "Outscan", href: "/portal/warehouse/outscan" },
  { label: "Manifest", href: "/portal/warehouse/manifest" },
  { label: "Delivery Challan", href: "/portal/delivery/challan" },
  { label: "Reports", href: "/portal/reports" },
  { label: "Day End Closing", href: "/portal/day-end" },
  { label: "Masters", href: "/portal/masters" },
  { label: "Users", href: "/portal/users" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-8">
        LOGICARTS LMS
      </h1>

      <div className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-3 text-slate-200 transition hover:bg-[#1877F2] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>

    </aside>
  );
}
