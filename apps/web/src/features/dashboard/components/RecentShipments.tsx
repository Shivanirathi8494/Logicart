type Props = {
  dashboard: any;
};

function statusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700";

    case "OUTSCAN":
    case "OUT_FOR_DELIVERY":
      return "bg-blue-50 text-blue-700";

    case "MANIFESTED":
      return "bg-slate-100 text-slate-700";

    case "INSCAN":
      return "bg-orange-50 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function RecentShipments({
  dashboard,
}: Props) {
  const shipments =
    dashboard.recentShipments ?? [];

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="border-b bg-slate-50 p-4 sm:p-5">
        <h2 className="text-lg font-bold text-[#0b2340] sm:text-xl">
          Recent Shipments
        </h2>
      </div>

      {!shipments.length ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No recent shipments.
        </div>
      ) : (
        <>
          {/* MOBILE */}
          <div className="divide-y sm:hidden">
            {shipments.map(
              (shipment: any) => (
                <div
                  key={shipment.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <div className="break-all font-bold text-[#0b2340]">
                        {shipment.trackingNumber}
                      </div>

                      <div className="mt-1 truncate text-sm text-slate-500">
                        {shipment.senderName || "-"}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>

                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Destination
                    </span>

                    <span className="font-semibold text-slate-700">
                      {shipment.destination}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>


          {/* TABLET / DESKTOP */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">
                    Tracking
                  </th>

                  <th className="p-4 text-left">
                    Sender
                  </th>

                  <th className="p-4 text-left">
                    Destination
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {shipments.map(
                  (shipment: any) => (
                    <tr
                      key={shipment.id}
                      className="border-t"
                    >
                      <td className="p-4 font-medium text-[#0b2340]">
                        {shipment.trackingNumber}
                      </td>

                      <td className="p-4">
                        {shipment.senderName}
                      </td>

                      <td className="p-4">
                        {shipment.destination}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass(
                            shipment.status
                          )}`}
                        >
                          {shipment.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

    </section>
  );
}
