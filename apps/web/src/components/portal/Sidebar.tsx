"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "Create Docket", href: "/portal/operations/create-docket" },
  { label: "Docket Management", href: "/portal/operations/search-docket" },
  { label: "Loading & Manifest", href: "/portal/warehouse/manifest" },
  { label: "Unloading Tally", href: "/portal/warehouse/inscan" },
  { label: "Search Manifest", href: "/portal/warehouse/manifest-search" },
  { label: "Delivery Challan", href: "/portal/delivery/challan" },
  { label: "Reports", href: "/portal/reports" },
  { label: "Day End Closing", href: "/portal/day-end" },
  { label: "Masters", href: "/portal/masters" },
  { label: "Users", href: "/portal/users" },
];

export default function Sidebar() {

  const router = useRouter();

  async function logout() {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    try {

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {

        alert("Unable to logout.");

        return;

      }

      router.replace("/login");
      router.refresh();

    } catch (error) {

      console.error(error);

      alert("Unable to logout.");

    }

  }

  return (

    <aside className="flex min-h-screen w-72 shrink-0 flex-col bg-slate-900 p-6 text-white">

      <Link
        href="/portal/dashboard"
        className="mb-8 flex justify-center"
      >
        <Image
          src="/logo/logicarts-logo.png"
          alt="Logicarts"
          width={180}
          height={55}
          priority
        className="h-auto w-auto"
        />
      </Link>

      <nav className="flex-1 space-y-2">

        {menu.map((item) => (

          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-3 text-slate-200 transition hover:bg-[#1877F2] hover:text-white"
          >
            {item.label}
          </Link>

        ))}

      </nav>

      <button
        onClick={logout}
        className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-3 text-red-400 transition hover:bg-red-600 hover:text-white"
      >
        <LogOut size={18} />
        Logout
      </button>

    </aside>

  );

}
