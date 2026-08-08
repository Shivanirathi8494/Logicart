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

      <div className="border-b p-5">

        <h2 className="text-xl font-semibold">
          Shipment List
        </h2>

      </div>

      <div className="overflow-x-auto">

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

      <div className="flex justify-end border-t bg-slate-50 p-5">

        <div className="space-y-2 text-right">

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
