"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Plane,
  Truck,
  Package,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");

  function trackShipment() {
    if (!trackingNumber.trim()) {
      alert("Please enter a AWB Number.");
      return;
    }

    router.push(
      "/tracking?trackingNumber=" +
        encodeURIComponent(trackingNumber)
    );
  }

  return (
    <section className="relative overflow-visible bg-[#0b2340]">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero-air-cargo.png')",
        }}
      />

      {/* Navy overlay */}
      <div className="absolute inset-0 bg-[#071d36]/75" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#071d36] via-[#071d36]/75 to-[#071d36]/45" />

      {/* Hero content */}
      <div className="relative mx-auto max-w-7xl px-6 pb-40 pt-20 lg:pt-24">

        <div className="max-w-3xl text-white">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff7417]/70 bg-[#ff7417]/10 px-4 py-2 text-sm font-semibold tracking-wide text-orange-100">
            <span className="h-2 w-2 rounded-full bg-[#ff7417]" />
            31+ STRATEGIC CITIES. ONE NETWORK.
          </div>

          <h1 className="mt-8 text-6xl font-black leading-[0.91] tracking-tight sm:text-7xl lg:text-[82px]">
            LOGICARTS
            <br />
            <span className="text-[#ff7417]">PAN INDIA</span>
            <br />
            <span className="text-[#ff7417]">COVERAGE</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            From metros to Tier-3 towns, we connect India with a robust
            air, road, and last-mile network built for reliability.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">

            <Button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-full bg-[#ff7417] px-7 py-6 text-base font-semibold text-white shadow-lg shadow-orange-900/30 hover:bg-[#e9680d]"
            >
              Explore Services
              <ArrowRight className="ml-2" size={18} />
            </Button>

            <Button
              onClick={() => router.push("/contact")}
              variant="outline"
              className="rounded-full border-2 border-white/60 bg-transparent px-7 py-6 text-base font-semibold text-white hover:bg-white hover:text-[#0b2340]"
            >
              Get a Quote
            </Button>

          </div>

          <div className="mt-9 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-sm">
              <Plane size={16} className="text-[#ff7417]" />
              Air Cargo
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-sm">
              <Truck size={16} className="text-[#ff7417]" />
              Domestic
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-sm">
              <Package size={16} className="text-[#ff7417]" />
              Express
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-sm">
              <Package size={16} className="text-[#ff7417]" />
              E-Commerce
            </div>

          </div>

        </div>
      </div>

      {/* Tracking panel */}
      <div className="absolute bottom-0 left-1/2 z-20 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 translate-y-1/2">
        <div className="rounded-[28px] bg-white px-7 py-7 shadow-2xl sm:px-9 lg:px-12 lg:py-8">

          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.15fr_auto]">

            {/* Tracking title */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold tracking-[0.12em] text-[#ff7417]">
                <Package size={17} />
                TRACK SHIPMENT
              </div>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0b2340]">
                Where is my parcel?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your tracking ID to get real-time shipment status.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={21}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={trackingNumber}
                onChange={(e) =>
                  setTrackingNumber(e.target.value.toUpperCase())
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    trackShipment();
                  }
                }}
                className="h-14 w-full rounded-full border border-slate-200 bg-slate-50 pl-14 pr-5 text-base text-[#0b2340] outline-none transition placeholder:text-slate-400 focus:border-[#ff7417] focus:ring-2 focus:ring-[#ff7417]/20"
                placeholder="e.g. LG12345"
              />
            </div>

            {/* Track button */}
            <Button
              onClick={trackShipment}
              className="h-14 rounded-full bg-[#ff7417] px-9 text-base font-semibold text-white shadow-lg shadow-orange-900/20 hover:bg-[#e9680d]"
            >
              Track Now
              <ArrowRight className="ml-2" size={18} />
            </Button>

          </div>

        </div>
      </div>

    </section>
  );
}
