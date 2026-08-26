"use client";

import {
  useState,
} from "react";

import {
  Menu,
} from "lucide-react";

import Sidebar from "@/components/portal/Sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* DESKTOP SIDEBAR */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar />
      </div>


      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(true)
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div className="text-center">
          <div className="text-lg font-extrabold tracking-tight text-[#0b2340]">
            Logicarts
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ff7417]">
            Air Cargo Operations
          </div>
        </div>

        <div className="h-10 w-10" />

      </header>


      {/* MOBILE SIDEBAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* OVERLAY */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="absolute inset-0 bg-slate-950/55"
          />

          {/* DRAWER */}
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] shadow-2xl">

            <Sidebar
              mobile
              onNavigate={() =>
                setMobileMenuOpen(false)
              }
            />

          </div>

        </div>
      )}


      {/* PAGE CONTENT */}
      <main className="min-w-0 p-4 sm:p-5 lg:ml-72 lg:p-8">

        <div className="mx-auto w-full max-w-[1600px]">
          {children}
        </div>

      </main>

    </div>
  );
}
