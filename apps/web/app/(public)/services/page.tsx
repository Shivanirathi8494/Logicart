import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";

const services = [
  {
    title: "Air Cargo",
    eyebrow: "DOMESTIC & INTERNATIONAL AIR FREIGHT",
    description:
      "Priority air freight solutions with end-to-end visibility across our nationwide airport network.",
    features: [
      "Same-day dispatch",
      "Live flight tracking",
      "Secure cargo handling",
      "DGR certified",
    ],
    image: "/services/service-air-cargo.png",
  },
  {
    title: "Express Cargo",
    image: "/services/service-express-cargo.png",
    eyebrow: "FAST TIME-CRITICAL DELIVERIES",
    description:
      "Time-definite express shipments backed by SLA guarantees and priority movement.",
    features: [
      "Guaranteed SLAs",
      "Priority uplift",
      "Real-time updates",
      "POD digitally",
    ],
  },
  {
    title: "E-Commerce",
    image: "/services/service-ecommerce.png",
    eyebrow: "LAST-MILE & FULFILMENT LOGISTICS",
    description:
      "Complete e-commerce logistics — pick, pack, ship, RTO management and pin-code intelligence.",
    features: [
      "Pin-code intelligence",
      "COD & Prepaid",
      "RTO management",
      "Multi-carrier",
    ],
  },
  {
    title: "Critical Shipment",
    image: "/services/service-critical-shipment.png",
    eyebrow: "PRIORITY & SENSITIVE SHIPMENTS",
    description:
      "Specialised handling for pharmaceuticals, semiconductors, high-value and time-sensitive cargo.",
    features: [
      "Temperature control",
      "Security escort",
      "Chain of custody",
      "Direct routing",
    ],
  },
  {
    title: "Domestic Trade",
    image: "/services/service-domestic-trade.png",
    eyebrow: "PAN INDIA PTL, FTL & LMD",
    description:
      "Reliable surface network with Part Truck Load, Full Truck Load and Last Mile Delivery.",
    features: [
      "PTL & FTL",
      "Route optimisation",
      "GPS enabled fleet",
      "Bonded warehousing",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive logistics solutions designed to meet the needs of businesses across India."
      />

      <PageContainer>
        <div className="space-y-24 py-16 lg:space-y-32 lg:py-20">
          {services.map((service, index) => {
            const imageOnLeft = index % 2 === 0;

            return (
              <section
                key={service.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* Image */}
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-[28px] bg-slate-100 shadow-sm ${
                    imageOnLeft ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0b2340] to-[#173b5e]">
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-[#ff7417] shadow-sm">
                          ✦
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff7417]">
                          Logicarts
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[#ff7417] shadow-lg">
                    {index === 0 && "✈"}
                    {index === 1 && "ϟ"}
                    {index === 2 && "▢"}
                    {index === 3 && "♢"}
                    {index === 4 && "▣"}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`${
                    imageOnLeft ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ff7417]">
                    {service.eyebrow}
                  </p>

                  <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0b2340] sm:text-5xl">
                    {service.title}
                  </h2>

                  <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-[15px] font-medium text-slate-700"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ff7417] text-xs text-[#ff7417]">
                          ✓
                        </span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#ff7417] px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#e9630b]"
                  >
                    Get a Quote
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </section>
            );
          })}
        </div>
      </PageContainer>
    </>
  );
}
