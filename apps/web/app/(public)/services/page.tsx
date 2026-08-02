import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";

const services = [
  {
    title: "Air Cargo",
    description: "Fast and secure air freight solutions across India."
  },
  {
    title: "Express Cargo",
    description: "Time-critical deliveries for urgent consignments."
  },
  {
    title: "Critical Shipment",
    description: "Dedicated handling for sensitive and high-priority cargo."
  },
  {
    title: "Domestic Trade",
    description: "Reliable logistics through our nationwide network."
  },
  {
    title: "E-Commerce Logistics",
    description: "Fulfilment and last-mile delivery solutions."
  }
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive logistics solutions designed to meet the needs of businesses across India."
      />

      <PageContainer>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
            >
              <h2 className="text-2xl font-semibold">
                {service.title}
              </h2>

              <p className="mt-4 text-gray-600">
                {service.description}
              </p>
            </div>
          ))}

        </div>
      </PageContainer>    </>
  );
}
