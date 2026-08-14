import {
  Plane,
  Truck,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    title: "Air Cargo",
    icon: Plane,
    desc: "Domestic & International Air Freight",
    eyebrow: "DOMESTIC & INTERNATIONAL AIR FREIGHT",
  },
  {
    title: "Express Cargo",
    icon: PackageCheck,
    desc: "Fast Time Critical Deliveries",
    eyebrow: "FAST TIME-CRITICAL DELIVERIES",
  },
  {
    title: "E-Commerce",
    icon: ShoppingCart,
    desc: "Last Mile & Fulfilment Logistics",
    eyebrow: "LAST-MILE & FULFILMENT LOGISTICS",
  },
  {
    title: "Critical Shipment",
    icon: ShieldCheck,
    desc: "Priority & Sensitive Shipments",
    eyebrow: "PRIORITY & SENSITIVE SHIPMENTS",
  },
  {
    title: "Domestic Trade",
    icon: Truck,
    desc: "Pan India Distribution Network with PTL, FTL, LMD",
    eyebrow: "PAN INDIA PTL, FTL & LMD",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[#f5f8fc] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
              Our Services
            </p>

            <h2 className="mt-4 max-w-3xl text-5xl font-black leading-tight tracking-tight text-[#0b2340] sm:text-6xl">
              Comprehensive logistics for every business.
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-slate-500">
            Reliable air, express, e-commerce, critical shipment and
            domestic distribution solutions.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden bg-[#0b2340]">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-55 transition duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: "url('/hero-air-cargo.png')",
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071d36] via-[#071d36]/55 to-transparent" />

                  <div className="relative flex h-full flex-col justify-between p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#ff7417] shadow-lg">
                      <Icon size={28} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold tracking-wide text-[#ffad7d]">
                        {service.eyebrow}
                      </p>

                      <h3 className="mt-2 text-3xl font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-7">
                  <p className="min-h-14 text-base leading-7 text-slate-500">
                    {service.desc}
                  </p>

                  <div className="mt-6 flex items-center gap-2 font-semibold text-[#0b2340] transition group-hover:text-[#ff7417]">
                    Learn more
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
