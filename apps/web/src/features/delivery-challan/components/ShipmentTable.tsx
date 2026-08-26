"use client";

type Props = {
  shipments: any[];
};

export default function ShipmentTable({
  shipments,
}: Props) {

  if (!shipments.length) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center text-slate-500 sm:p-10">
        No shipments selected.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="border-b p-4 sm:p-5">

        <h2 className="text-lg font-bold text-[#0b2340]">
          Selected Shipments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {shipments.length} shipment
          {shipments.length === 1 ? "" : "s"} selected
        </p>

      </div>


      {/* MOBILE */}
      <div className="divide-y md:hidden">

        {shipments.map(
          (shipment, index) => (

            <div
              key={shipment.id}
              className="p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <div className="text-xs text-slate-400">
                    Shipment {index + 1}
                  </div>

                  <div className="mt-1 break-all font-bold text-[#0b2340]">
                    {shipment.trackingNumber}
                  </div>

                </div>

                <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-[#ff7417]">
                  OUTSCAN
                </span>

              </div>


              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">

                <div>
                  <div className="text-xs text-slate-400">
                    Route
                  </div>

                  <div className="mt-1 font-semibold">
                    {shipment.origin}

                    <span className="mx-2 text-[#ff7417]">
                      →
                    </span>

                    {shipment.destination}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Pieces
                  </div>

                  <div className="mt-1 font-semibold">
                    {shipment.packageCount ?? 0}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Sender
                  </div>

                  <div className="mt-1 break-words">
                    {shipment.senderName || "—"}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Receiver
                  </div>

                  <div className="mt-1 break-words">
                    {shipment.receiverName || "—"}
                  </div>
                </div>


                <div className="col-span-2">
                  <div className="text-xs text-slate-400">
                    Chargeable Weight
                  </div>

                  <div className="mt-1 font-semibold">
                    {Number(
                      shipment.chargeableWeight ?? 0
                    ).toFixed(2)} Kg
                  </div>
                </div>

              </div>

            </div>

          )
        )}

      </div>


      {/* DESKTOP — SAME TABLE STRUCTURE */}
      <div className="hidden overflow-x-auto md:block">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Tracking No
              </th>

              <th className="p-4 text-left">
                Sender
              </th>

              <th className="p-4 text-left">
                Receiver
              </th>

              <th className="p-4 text-left">
                Origin
              </th>

              <th className="p-4 text-left">
                Destination
              </th>

              <th className="p-4 text-left">
                Pieces
              </th>

              <th className="p-4 text-left">
                Weight
              </th>

            </tr>

          </thead>


          <tbody>

            {shipments.map(
              (shipment) => (

                <tr
                  key={shipment.id}
                  className="border-t"
                >

                  <td className="p-4 font-semibold">
                    {shipment.trackingNumber}
                  </td>

                  <td className="p-4">
                    {shipment.senderName}
                  </td>

                  <td className="p-4">
                    {shipment.receiverName}
                  </td>

                  <td className="p-4">
                    {shipment.origin}
                  </td>

                  <td className="p-4">
                    {shipment.destination}
                  </td>

                  <td className="p-4">
                    {shipment.packageCount}
                  </td>

                  <td className="p-4">
                    {shipment.chargeableWeight} Kg
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}
