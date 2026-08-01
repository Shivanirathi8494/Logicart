import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";
import { Button } from "@/components/ui/button";

const opportunities = [
  {
    title: "Delivery Partner",
    description: "Become a Delivery Partner. Drive Success with Logicarts."
  },
  {
    title: "Fleet Owner",
    description: "Join India's Growing Logistics Network as a Fleet Partner."
  },
  {
    title: "Franchise Partner",
    description: "Own Your Market with the Power of Logicarts."
  },
  {
    title: "Warehouse Partner",
    description: "Partner Your Warehouse. Power India's Supply Chains."
  },
  {
    title: "Transport Vendor",
    description: "One Network. Endless Freight Opportunities."
  },
  {
    title: "Sales Associate",
    description: "Your Business. Your Growth. Your Success."
  }
];

export default function CareerPage() {
  return (
    <>
      <PageHero
        title="Careers & Partnerships"
        subtitle="Join the Logicarts network and grow your business with us."
      />

      <PageContainer>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {opportunities.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
            >
              <h2 className="text-2xl font-semibold">
                {item.title}
              </h2>

              <p className="mt-4 text-gray-600">
                {item.description}
              </p>

              <Button className="mt-6 w-full">
                Apply Now
              </Button>
            </div>
          ))}

        </div>
      </PageContainer>    </>
  );
}
