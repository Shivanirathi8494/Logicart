"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    roles: [
      "ADMIN",
      "CLIENT",
      "AGENT",
      "EMPLOYEE",
      "BOOKING",
      "WAREHOUSE",
      "DELIVERY",
      "ACCOUNTS",
      "READONLY",
    ],
  },
  {
    label: "Create Docket",
    href: "/portal/operations/create-docket",
    roles: ["ADMIN", "CLIENT", "AGENT", "EMPLOYEE", "BOOKING"],
  },
  {
    label: "Docket Management",
    href: "/portal/operations/search-docket",
    roles: [
      "ADMIN",
      "CLIENT",
      "AGENT",
      "EMPLOYEE",
      "BOOKING",
      "WAREHOUSE",
      "DELIVERY",
      "ACCOUNTS",
      "READONLY",
    ],
  },
  {
    label: "Docket Update",
    href: "/portal/operations/update-status",
    roles: ["ADMIN", "EMPLOYEE", "BOOKING"],
  },
  {
    label: "Loading & Manifest",
    href: "/portal/warehouse/manifest",
    roles: ["ADMIN", "WAREHOUSE"],
  },
  {
    label: "Unloading Tally",
    href: "/portal/warehouse/inscan",
    roles: ["ADMIN", "EMPLOYEE", "WAREHOUSE"],
  },
  {
    label: "Outscan",
    href: "/portal/warehouse/outscan",
    roles: ["ADMIN", "EMPLOYEE", "WAREHOUSE"],
  },
  {
    label: "Search Manifest",
    href: "/portal/warehouse/manifest-search",
    roles: ["ADMIN", "WAREHOUSE"],
  },
  {
    label: "Delivery Challan",
    href: "/portal/delivery/challan",
    roles: ["ADMIN", "EMPLOYEE", "DELIVERY"],
  },
  {
    label: "Reports",
    href: "/portal/reports",
    roles: ["ADMIN"],
  },
  {
    label: "Day End Closing",
    href: "/portal/day-end",
    roles: ["ADMIN"],
  },
  {
    label: "Masters",
    href: "/portal/masters",
    roles: ["ADMIN"],
  },
];

export default function Sidebar() {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));
  }, []);

  async function logout() {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

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

  const visibleMenu = menu.filter(
    (item) => role && item.roles.includes(role)
  );

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
        {visibleMenu.map((item) => (
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
