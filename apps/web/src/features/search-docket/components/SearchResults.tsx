"use client";

type Props = {
  loading: boolean;
  rows: any[];
  onSelect: (shipment: any) => void;
  hasSearched: boolean;
};

export default function SearchResults({
  loading,
  rows,
  onSelect,
  hasSearched,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading shipments...
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
        No shipments found.
      </div>
    );
  }

  return (
    <section className="w-full overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="w-[10%] px-2 py-3 text-left">AWB Number</th>
            <th className="w-[8%] px-2 py-3 text-left">Booking Date</th>
            <th className="w-[6%] px-2 py-3 text-left">Origin</th>
            <th className="w-[7%] px-2 py-3 text-left">Destination</th>
            <th className="w-[9%] px-2 py-3 text-left">Sender</th>
            <th className="w-[10%] px-2 py-3 text-left">Receiver</th>
            <th className="w-[7%] px-2 py-3 text-left">Weight</th>
            <th className="w-[9%] px-2 py-3 text-left">Amount</th>
            <th className="w-[7%] px-2 py-3 text-left">Status</th>
            <th className="w-[27%] px-2 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="truncate px-2 py-3 font-semibold">
                {row.trackingNumber}
              </td>

              <td className="whitespace-nowrap px-2 py-3">
                {row.bookingDate
                  ? new Date(row.bookingDate).toLocaleDateString()
                  : "-"}
              </td>

              <td className="px-2 py-3">
                {row.origin || "-"}
              </td>

              <td className="px-2 py-3">
                {row.destination || "-"}
              </td>

              <td className="truncate px-2 py-3">
                {row.senderName || "-"}
              </td>

              <td className="truncate px-2 py-3">
                {row.receiverName || "-"}
              </td>

              <td className="whitespace-nowrap px-2 py-3">
                {row.chargeableWeight ?? 0} Kg
              </td>

              <td className="whitespace-nowrap px-2 py-3">
                ₹ {Number(row.total || 0).toFixed(2)}
              </td>

              <td className="px-2 py-3">
                <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  {row.status}
                </span>
              </td>

              <td className="px-2 py-3">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap">

                  {hasSearched && (
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-md bg-[#1877F2] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Manage
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/portal/docket/preview?tracking=${encodeURIComponent(
                          row.trackingNumber
                        )}`,
                        "_blank"
                      )
                    }
                    className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-slate-100"
                  >
                    Preview
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/api/airwaybill/${encodeURIComponent(
                          row.trackingNumber
                        )}`,
                        "_blank"
                      )
                    }
                    className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-slate-100"
                  >
                    Print
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        `/portal/operations/create-docket?tracking=${encodeURIComponent(
                          row.trackingNumber
                        )}`)
                    }
                    className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-slate-100"
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
