type Props = {
  headers: string[];
  rows: string[][];
};

export default function ReportTable({
  headers,
  rows,
}: Props) {

  return (

    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            {headers.map((header) => (

              <th
                key={header}
                className="p-4 text-left"
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

  );

}
