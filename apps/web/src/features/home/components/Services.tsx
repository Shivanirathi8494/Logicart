import {
  Plane,
  Truck,
  PackageCheck,
  ShieldCheck,
  ShoppingCart
} from "lucide-react";

const services = [
  {
    title: "Air Cargo",
    icon: Plane,
    desc: "Domestic & International Air Freight"
  },
  {
    title: "Express Cargo",
    icon: PackageCheck,
    desc: "Fast Time Critical Deliveries"
  },
  {
    title: "E-Commerce",
    icon: ShoppingCart,
    desc: "Last Mile & Fulfilment Logistics"
  },
  {
    title: "Critical Shipment",
    icon: ShieldCheck,
    desc: "Priority & Sensitive Shipments"
  },
  {
    title: "Domestic Trade",
    icon: Truck,
    desc: "Pan India Distribution Network with PTL, FTL, LMD"
  }
];

export default function Services() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-5xl font-bold">
            Our Services
          </h2>

          <p className="mt-5 text-gray-500">
            Comprehensive logistics solutions for every business.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {services.map((service) => {

            const Icon = service.icon;

            return (

              <div
                key={service.title}
                className="rounded-3xl bg-white p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
              >

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1877F2]/10">

                  <Icon
                    className="text-[#1877F2]"
                    size={34}
                  />

                </div>

                <h3 className="text-2xl font-bold">
                  {service.title}
                </h3>

                <p className="mt-4 text-gray-500">
                  {service.desc}
                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
