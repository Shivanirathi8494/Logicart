"use client";

type Props = {
  loading: boolean;
  rows: any[];
};

export default function SearchResults({
  loading,
  rows,
}: Props) {

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading shipments...
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
        No shipments found.
      </div>
    );
  }

  return (

    <section className="overflow-x-auto rounded-xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-4 text-left">Tracking No</th>

            <th className="p-4 text-left">Booking Date</th>

            <th className="p-4 text-left">Origin</th>

            <th className="p-4 text-left">Destination</th>

            <th className="p-4 text-left">Sender</th>

            <th className="p-4 text-left">Receiver</th>

            <th className="p-4 text-left">Weight</th>

            <th className="p-4 text-left">Amount</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row) => (

            <tr
              key={row.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-4 font-semibold">
                {row.trackingNumber}
              </td>

              <td className="p-4">
                {new Date(row.bookingDate).toLocaleDateString()}
              </td>

              <td className="p-4">
                {row.origin}
              </td>

              <td className="p-4">
                {row.destination}
              </td>

              <td className="p-4">
                {row.senderName}
              </td>

              <td className="p-4">
                {row.receiverName}
              </td>

              <td className="p-4">
                {row.chargeableWeight} Kg
              </td>

              <td className="p-4">
                ₹ {row.total}
              </td>

              <td className="p-4">

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">

                  {row.status}

                </span>

              </td>

              <td className="p-4">

                <div className="flex justify-center gap-2">

                  <button
                    className="rounded border px-3 py-2 hover:bg-slate-100"
                  >
                    View
                  </button>

                  <button
                    className="rounded border px-3 py-2 hover:bg-slate-100"
                  >
                    Print
                  </button>

                  <button
                    className="rounded border px-3 py-2 hover:bg-slate-100"
                  >
                    Edit
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </section>

  );

}
