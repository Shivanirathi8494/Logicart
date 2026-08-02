import { ArrowRight, Plane, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1877F2] via-[#1565D8] to-[#0B57D0]">

      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-28">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div className="text-white">
            <h1 className="mt-8 text-6xl font-extrabold leading-tight">
              LOGICARTS
              ALWAYS ON TIME
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-blue-100">
              Integrated, technology-driven multimodal logistics solutions 
              across Air, Surface, Warehousing, Express, E-commerce and 
              End-to-End Supply Chain Distribution across India.
            </p>

            <div className="mt-16 flex gap-10">

              <div className="flex items-center gap-2">
                <Plane />
                Air Cargo
              </div>

              <div className="flex items-center gap-2">
                <Truck />
                Domestic
              </div>

              <div className="flex items-center gap-2">
                <Package />
                Express
              </div>

            </div>

          </div>

          <div>

            <div className="rounded-3xl bg-white p-10 shadow-2xl">

              <h2 className="text-3xl font-bold text-[#1877F2]">
                Track Shipment
              </h2>

              <p className="mt-3 text-gray-500">
                Enter your Tracking ID to get the latest shipment status.
              </p>

              <input
                className="mt-8 w-full rounded-xl border p-4"
                placeholder="Enter Tracking ID"
              />

              <Button className="mt-6 w-full">
                Track Now
              </Button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
