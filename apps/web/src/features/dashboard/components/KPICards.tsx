type Props = {
  dashboard: any;
};

export default function KPICards({
  dashboard,
}: Props) {
  const cards = [
    {
      title: "Booked",
      value: dashboard.booked,
    },
    {
      title: "Inscan",
      value: dashboard.inscan,
    },
    {
      title: "Outscan",
      value: dashboard.outscan,
    },
    {
      title: "Open Manifest",
      value: dashboard.openManifests,
    },
    {
      title: "Open Challans",
      value: dashboard.openChallans,
    },
  ];

  if (dashboard.revenue !== undefined) {
    cards.splice(3, 0, {
      title: "Revenue",
      value: "₹ " + dashboard.revenue,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="min-w-0 rounded-xl border bg-white p-4 shadow-sm sm:p-5 lg:p-6"
        >
          <div className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            {card.title}
          </div>

          <div className="mt-2 break-words text-2xl font-bold text-[#0b2340] sm:mt-3 sm:text-3xl">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
