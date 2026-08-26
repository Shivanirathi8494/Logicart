type Props = {
  headers: string[];
  rows: string[][];
};

export default function ReportTable({
  headers,
  rows,
}: Props) {

  if (!rows.length) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500 sm:p-10">
        No report data found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      {/* MOBILE */}
      <div className="divide-y md:hidden">

        {rows.map((row, rowIndex) => (

          <div
            key={rowIndex}
            className="p-4"
          >

            {headers.map((header, index) => (

              <div
                key={header + index}
                className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0"
              >

                <div className="shrink-0 text-xs font-medium text-slate-400">
                  {header}
                </div>

                <div className="min-w-0 break-words text-right text-sm font-medium text-slate-700">
                  {row[index] ?? "—"}
                </div>

              </div>

            ))}

          </div>

        ))}

      </div>


      {/* DESKTOP */}
      <div className="hidden overflow-x-auto md:block">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              {headers.map((header) => (

                <th
                  key={header}
                  className="whitespace-nowrap p-4 text-left"
                >
                  {header}
                </th>

              ))}

            </tr>

          </thead>


          <tbody>

            {rows.map((row, index) => (

              <tr
                key={index}
                className="border-t hover:bg-slate-50"
              >

                {row.map((cell, cellIndex) => (

                  <td
                    key={cellIndex}
                    className="p-4"
                  >
                    {cell}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
