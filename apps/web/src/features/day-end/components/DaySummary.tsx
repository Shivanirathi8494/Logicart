type Props = {
  summary: any;
};

export default function DaySummary({
  summary,
}: Props) {

  const rows = [
    [
      "Business Date",
      new Date(
        summary.businessDate
      ).toLocaleDateString(),
    ],
    [
      "Branch",
      summary.branch,
    ],
    [
      "Bookings",
      summary.bookingCount,
    ],
    [
      "Manifests",
      summary.manifestCount,
    ],
    [
      "Outscan",
      summary.outscanCount,
    ],
    [
      "Delivered",
      summary.deliveredCount,
    ],
    [
      "Pending Delivery",
      summary.pendingDelivery,
    ],
    [
      "Revenue",
      "₹ " + summary.revenue,
    ],
    [
      "Cash Collection",
      "₹ " + summary.cashCollection,
    ],
    [
      "Online Collection",
      "₹ " + summary.onlineCollection,
    ],
  ];

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="border-b bg-slate-50 p-4 sm:p-5">

        <h2 className="text-lg font-bold text-[#0b2340] sm:text-xl">
          Operational Summary
        </h2>

      </div>


      {/* MOBILE */}
      <div className="divide-y md:hidden">

        {rows.map(
          ([label, value]) => (

            <div
              key={String(label)}
              className="flex items-start justify-between gap-4 px-4 py-3.5"
            >

              <div className="text-sm font-medium text-slate-500">
                {label}
              </div>

              <div className="min-w-0 break-words text-right text-sm font-bold text-[#0b2340]">
                {value}
              </div>

            </div>

          )
        )}

      </div>


      {/* DESKTOP */}
      <table className="hidden min-w-full md:table">

        <tbody>

          {rows.map(
            ([label, value]) => (

              <tr
                key={String(label)}
                className="border-t"
              >

                <td className="w-80 bg-slate-50 p-4 font-semibold">
                  {label}
                </td>

                <td className="p-4">
                  {value}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </section>
  );
}
