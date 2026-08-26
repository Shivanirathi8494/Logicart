"use client";

type Props = {
  shipments: any[];
  onRemove: (trackingNumber: string) => void;
};

export default function ShipmentTable({
  shipments,
  onRemove,
}: Props) {

  const totalPieces = shipments.reduce(
    (sum, s) => sum + (s.packageCount ?? 0),
    0
  );

  const totalWeight = shipments.reduce(
    (sum, s) => sum + (s.chargeableWeight ?? 0),
    0
  );

  return (

    <section className="rounded-xl border bg-white shadow-sm">

      <div className="border-b p-4 sm:p-5">

        <h2 className="text-lg font-semibold text-[#0b2340] sm:text-xl">
          Shipment List
        </h2>

      </div>

      {/* MOBILE SHIPMENT CARDS */}
      <div className="divide-y md:hidden">

        {shipments.length === 0 ? (

          <div className="p-8 text-center text-sm text-slate-500">
            No shipments added.
          </div>

        ) : (

          shipments.map((shipment, index) => (

            <div
              key={shipment.trackingNumber}
              className="p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <div className="text-xs font-medium text-slate-400">
                    Shipment {index + 1}
                  </div>

                  <div className="mt-1 break-all font-bold text-[#0b2340]">
                    {shipment.trackingNumber}
                  </div>

                </div>

                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                  {shipment.status}
                </span>

              </div>


              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">

                <div>
                  <div className="text-xs text-slate-400">
                    Sender
                  </div>

                  <div className="mt-1 break-words font-medium text-slate-700">
                    {shipment.senderName || "—"}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Receiver
                  </div>

                  <div className="mt-1 break-words font-medium text-slate-700">
                    {shipment.receiverName || "—"}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Pieces
                  </div>

                  <div className="mt-1 font-semibold text-slate-700">
                    {shipment.packageCount ?? 0}
                  </div>
                </div>


                <div>
                  <div className="text-xs text-slate-400">
                    Weight
                  </div>

                  <div className="mt-1 font-semibold text-slate-700">
                    {Number(
                      shipment.chargeableWeight ?? 0
                    ).toFixed(2)} Kg
                  </div>
                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  onRemove(
                    shipment.trackingNumber
                  )
                }
                className="mt-4 min-h-11 w-full rounded-lg border border-red-500 bg-white px-4 py-2.5 font-semibold text-red-600"
              >
                Remove
              </button>

            </div>

          ))

        )}

      </div>


      {/* DESKTOP SHIPMENT TABLE */}
      <div className="hidden overflow-x-auto md:block">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-3 text-left">#</th>

              <th className="p-3 text-left">
                AWB Number
              </th>

              <th className="p-3 text-left">
                Sender
              </th>

              <th className="p-3 text-left">
                Receiver
              </th>

              <th className="p-3 text-center">
                Pieces
              </th>

              <th className="p-3 text-right">
                Weight (Kg)
              </th>

              <th className="p-3 text-center">
                Status
              </th>

              <th className="p-3 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {shipments.length === 0 && (

              <tr>

                <td
                  colSpan={8}
                  className="p-10 text-center text-slate-500"
                >
                  No shipments added.
                </td>

              </tr>

            )}

            {shipments.map((shipment,index)=>(

              <tr
                key={shipment.trackingNumber}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-3">
                  {index+1}
                </td>

                <td className="p-3 font-semibold">
                  {shipment.trackingNumber}
                </td>

                <td className="p-3">
                  {shipment.senderName}
                </td>

                <td className="p-3">
                  {shipment.receiverName}
                </td>

                <td className="p-3 text-center">
                  {shipment.packageCount}
                </td>

                <td className="p-3 text-right">
                  {shipment.chargeableWeight.toFixed(2)}
                </td>

                <td className="p-3 text-center">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

                    {shipment.status}

                  </span>

                </td>

                <td className="p-3 text-center">

                  <button
                    onClick={() =>
                      onRemove(
                        shipment.trackingNumber
                      )
                    }
                    className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="border-t bg-slate-50 p-4 sm:flex sm:justify-end sm:p-5">

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:block sm:space-y-2 sm:text-right">

          <div>

            <strong>Total Shipments :</strong>{" "}
            {shipments.length}

          </div>

          <div>

            <strong>Total Pieces :</strong>{" "}
            {totalPieces}

          </div>

          <div>

            <strong>Total Weight :</strong>{" "}
            {totalWeight.toFixed(2)} Kg

          </div>

        </div>

      </div>

    </section>

  );

}
