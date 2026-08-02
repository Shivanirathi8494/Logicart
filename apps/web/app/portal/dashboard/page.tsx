const stats = [
  { title: "Today's Dockets", value: "0" },
  { title: "Pending Pickup", value: "0" },
  { title: "Inscan Pending", value: "0" },
  { title: "Outscan Pending", value: "0" },
  { title: "Delivered Today", value: "0" },
  { title: "Day End Status", value: "Open" },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome to the Logicarts Logistics Management System.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {card.title}
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#1877F2]">
              {card.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
