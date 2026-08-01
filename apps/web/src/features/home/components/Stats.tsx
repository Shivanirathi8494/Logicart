export default function Stats() {
  const stats = [
    ["500+", "Corporate Clients"],
    ["12000+", "Shipments Delivered"],
    ["150+", "Cities Connected"],
    ["24×7", "Customer Support"]
  ];

  return (
    <section className="bg-white py-16">

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">

        {stats.map(([value, label]) => (

          <div
            key={label}
            className="rounded-2xl border bg-white p-8 text-center shadow-sm"
          >
            <h2 className="text-5xl font-bold text-[#1877F2]">
              {value}
            </h2>

            <p className="mt-3 text-gray-500">
              {label}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}
