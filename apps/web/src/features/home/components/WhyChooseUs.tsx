const items = [
  "Real-Time Shipment Tracking",
  "Pan India Air Network",
  "Secure Cargo Handling",
  "Dedicated Customer Support",
  "Time Critical Deliveries",
  "Technology Driven Logistics"
];

export default function WhyChooseUs() {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-5xl font-bold">
            Why Choose Logicarts
          </h2>

          <p className="mt-4 text-gray-500">
            Trusted by businesses for reliable logistics.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {items.map((item) => (

            <div
              key={item}
              className="rounded-2xl border bg-white p-8 shadow-sm hover:border-[#1877F2]"
            >

              <div className="mb-4 text-3xl">
                ✓
              </div>

              <h3 className="text-xl font-semibold">
                {item}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
