"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  PlaneTakeoff,
  PlaneLanding,
  Truck,
  LogOut,
  WalletCards,
  UserRound,
  PackageSearch,
} from "lucide-react";

type CurrentUser = {
  role: string;
  branchCode?: string | null;
  branchName?: string | null;
};

const menu = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    roles: [
      "ADMIN",
      "CLIENT",
      "AGENT",
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
    roles: ["ADMIN", "CLIENT", "AGENT", "BOOKING"],
  },

  {
    label: "Docket Management",
    href: "/portal/operations/search-docket",
    roles: [
      "ADMIN",
      "CLIENT",
      "AGENT",
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
    roles: ["ADMIN", "BOOKING"],
  },

  {
    label: "Loading & Manifest",
    href: "/portal/warehouse/manifest",
    roles: ["ADMIN", "WAREHOUSE"],
  },

  {
    label: "Unloading Tally",
    href: "/portal/warehouse/inscan",
    roles: ["ADMIN", "WAREHOUSE"],
  },

  {
    label: "Outscan",
    href: "/portal/warehouse/outscan",
    roles: ["ADMIN", "WAREHOUSE"],
  },

  {
    label: "Search Manifest",
    href: "/portal/warehouse/manifest-search",
    roles: ["ADMIN", "WAREHOUSE"],
  },

  {
    label: "Delivery Challan",
    href: "/portal/delivery/challan",
    roles: ["ADMIN", "DELIVERY"],
  },

  {
    label: "Out for Delivery",
    href: "/portal/delivery/out-for-delivery",
    roles: ["ADMIN", "DELIVERY"],
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

export default function Sidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => setCurrentUser(data ?? null))
      .catch(() => setCurrentUser(null));
  }, []);

  async function logout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

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

  const role = currentUser?.role ?? null;

  const isEmployee = role === "EMPLOYEE";
  const isClient = role === "CLIENT";

  function activeClass(href: string) {
    const active = pathname === href || pathname.startsWith(href + "/");

    return active
      ? "bg-[#1877F2] text-white shadow-sm"
      : "text-slate-200 hover:bg-slate-800 hover:text-white";
  }

  const visibleMenu = menu.filter((item) => role && item.roles.includes(role));

  return (
    <aside
      className={`flex h-full min-h-screen w-full flex-col overflow-y-auto bg-slate-900 p-5 text-white ${
        mobile ? "" : "w-72"
      }`}
    >
      {/* LOGO */}
      <Link href="/portal/dashboard" className="mb-5 flex justify-center">
        <Image
          src="/logo/logicarts-logo-v2.png"
          alt="Logicarts"
          width={180}
          height={55}
          priority
          className="h-auto w-auto"
        />
      </Link>

      {/* EMPLOYEE BRANCH */}
      {isEmployee && currentUser?.branchCode && (
        <div className="mb-7 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff7417]">
            Working Branch
          </div>

          <div className="mt-1 text-lg font-bold text-white">
            {currentUser.branchCode}
          </div>

          {currentUser.branchName && (
            <div className="text-xs text-slate-400">
              {currentUser.branchName}
            </div>
          )}
        </div>
      )}

      {isClient ? (
        /*
         * CLIENT NAVIGATION
         *
         * Clients only see their own commercial
         * and shipment workflow.
         */
        <nav className="flex-1">
          <div className="space-y-2">
            <SidebarLink
              href="/portal/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              className={activeClass("/portal/dashboard")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/operations/create-docket"
              label="New Booking"
              icon={<PlusCircle size={18} />}
              className={activeClass("/portal/operations/create-docket")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/my-bookings"
              label="My Bookings"
              icon={<ListChecks size={18} />}
              className={activeClass("/portal/my-bookings")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/tracking"
              label="Track Shipment"
              icon={<PackageSearch size={18} />}
              className={activeClass("/tracking")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/wallet"
              label="Wallet"
              icon={<WalletCards size={18} />}
              className={activeClass("/portal/wallet")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/profile"
              label="Profile"
              icon={<UserRound size={18} />}
              className={activeClass("/portal/profile")}
              onNavigate={onNavigate}
            />
          </div>
        </nav>
      ) : isEmployee ? (
        /*
         * EMPLOYEE NAVIGATION
         *
         * Keep this workflow based.
         *
         * The Work Queue decides the
         * next shipment-level action.
         */
        <nav className="flex-1">
          <div className="space-y-2">
            <SidebarLink
              href="/portal/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              className={activeClass("/portal/dashboard")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/operations/create-docket"
              label="New Booking"
              icon={<PlusCircle size={18} />}
              className={activeClass("/portal/operations/create-docket")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/operations/search-docket"
              label="Work Queue"
              icon={<ListChecks size={18} />}
              className={activeClass("/portal/operations/search-docket")}
              onNavigate={onNavigate}
            />
          </div>

          {/* ORIGIN */}
          <div className="mt-7">
            <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Origin Operations
            </div>

            <SidebarLink
              href="/portal/warehouse/manifest"
              label="Dispatch / Manifest"
              icon={<PlaneTakeoff size={18} />}
              className={activeClass("/portal/warehouse/manifest")}
              onNavigate={onNavigate}
            />
          </div>

          {/* DESTINATION */}
          <div className="mt-7">
            <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Destination Operations
            </div>

            <div className="space-y-2">
              <SidebarLink
                href="/portal/warehouse/inscan"
                label="Incoming / Unload"
                icon={<PlaneLanding size={18} />}
                className={activeClass("/portal/warehouse/inscan")}
                onNavigate={onNavigate}
              />

              <SidebarLink
                href="/portal/warehouse/outscan"
                label="Delivery Processing"
                icon={<Truck size={18} />}
                className={activeClass("/portal/warehouse/outscan")}
                onNavigate={onNavigate}
              />
            </div>
          </div>

          {/* DAY END - always the final employee navigation entry */}
          <div className="mt-7">
            <SidebarLink
              href="/portal/day-end"
              label="Day End Closing"
              icon={<ListChecks size={18} />}
              className={activeClass("/portal/day-end")}
              onNavigate={onNavigate}
            />
          </div>
        </nav>
      ) : role === "ADMIN" ? (
        /*
         * ADMIN NAVIGATION
         *
         * Admin follows the same operational
         * workflow as branch employees, with
         * additional management modules.
         */
        <nav className="flex-1">
          <div className="space-y-2">
            <SidebarLink
              href="/portal/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              className={activeClass("/portal/dashboard")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/operations/create-docket"
              label="New Booking"
              icon={<PlusCircle size={18} />}
              className={activeClass("/portal/operations/create-docket")}
              onNavigate={onNavigate}
            />

            <SidebarLink
              href="/portal/operations/search-docket"
              label="Work Queue"
              icon={<ListChecks size={18} />}
              className={activeClass("/portal/operations/search-docket")}
              onNavigate={onNavigate}
            />
          </div>

          <div className="mt-7">
            <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Origin Operations
            </div>

            <SidebarLink
              href="/portal/warehouse/manifest"
              label="Dispatch / Manifest"
              icon={<PlaneTakeoff size={18} />}
              className={activeClass("/portal/warehouse/manifest")}
              onNavigate={onNavigate}
            />
          </div>

          <div className="mt-7">
            <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Destination Operations
            </div>

            <div className="space-y-2">
              <SidebarLink
                href="/portal/warehouse/inscan"
                label="Incoming / Unload"
                icon={<PlaneLanding size={18} />}
                className={activeClass("/portal/warehouse/inscan")}
                onNavigate={onNavigate}
              />

              <SidebarLink
                href="/portal/warehouse/outscan"
                label="Delivery Processing"
                icon={<Truck size={18} />}
                className={activeClass("/portal/warehouse/outscan")}
                onNavigate={onNavigate}
              />
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Management
            </div>

            <div className="space-y-2">
              <SidebarLink
                href="/portal/reports"
                label="Reports"
                icon={<ListChecks size={18} />}
                className={activeClass("/portal/reports")}
                onNavigate={onNavigate}
              />

              <SidebarLink
                href="/portal/masters"
                label="Masters"
                icon={<ListChecks size={18} />}
                className={activeClass("/portal/masters")}
                onNavigate={onNavigate}
              />

              <SidebarLink
                href="/portal/admin/wallet-recharges"
                label="Wallet Recharges"
                icon={<WalletCards size={18} />}
                className={activeClass("/portal/admin/wallet-recharges")}
                onNavigate={onNavigate}
              />
            </div>
          </div>
        </nav>
      ) : (
        <nav className="flex-1 space-y-2">
          {visibleMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-lg px-4 py-3 transition ${activeClass(
                item.href,
              )}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <button
        type="button"
        onClick={logout}
        className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-red-500 px-4 py-3 text-red-400 transition hover:bg-red-600 hover:text-white"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${className}`}
    >
      {icon}

      <span className="font-medium">{label}</span>
    </Link>
  );
}
