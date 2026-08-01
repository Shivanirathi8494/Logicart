import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";

const values = [
  {
    title: "Our Mission",
    description:
      "To provide reliable, secure, and technology-driven logistics solutions that enable businesses to move faster."
  },
  {
    title: "Our Vision",
    description:
      "To become one of India's most trusted logistics and supply chain partners."
  },
  {
    title: "Core Values",
    description:
      "Integrity, Customer Focus, Innovation, Reliability, and Operational Excellence."
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Logicarts"
        subtitle="Delivering Trust. Driving Logistics."
      />

      <PageContainer>

        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold">
            Who We Are
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Logicarts is a logistics technology company focused on providing
            efficient cargo movement, shipment visibility, and customer-first
            logistics solutions across India.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {values.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
            >
              <h3 className="text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </PageContainer>    </>
  );
}
