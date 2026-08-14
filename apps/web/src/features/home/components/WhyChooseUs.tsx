import {
  Radar,
  Plane,
  LockKeyhole,
  Headphones,
  Clock3,
  Cpu,
} from "lucide-react";

const items = [
  {
    title: "Real-Time Shipment Tracking",
    description: "Live shipment visibility from pickup to delivery.",
    icon: Radar,
  },
  {
    title: "Pan India Air Network",
    description: "Direct connectivity across our strategic airport network.",
    icon: Plane,
  },
  {
    title: "Secure Cargo Handling",
    description: "Secure and controlled handling throughout the shipment journey.",
    icon: LockKeyhole,
  },
  {
    title: "Dedicated Customer Support",
    description: "Responsive support for your logistics operations.",
    icon: Headphones,
  },
  {
    title: "Time Critical Deliveries",
    description: "Priority movement for urgent and sensitive shipments.",
    icon: Clock3,
  },
  {
    title: "Technology Driven Logistics",
    description: "Technology-led operations with better shipment visibility.",
    icon: Cpu,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
              Why Choose Logicarts
            </p>

            <h2 className="mt-5 text-5xl font-black leading-[1.02] tracking-tight text-[#0b2340] sm:text-6xl">
              Trusted by businesses for{" "}
              <span className="text-[#ff7417]">
                reliable logistics.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              From individual shipments to business distribution,
              our technology-driven approach keeps your logistics
              moving reliably across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/about"
                className="rounded-full bg-[#ff7417] px-7 py-3.5 font-semibold text-white transition hover:bg-[#e9680d]"
              >
                Our Story
              </a>

              <a
                href="/services"
                className="rounded-full border-2 border-[#0b2340] px-7 py-3.5 font-semibold text-[#0b2340] transition hover:bg-[#0b2340] hover:text-white"
              >
                Explore Services
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-[#f7f9fc] p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b2340] text-[#ff7417]">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#0b2340]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
