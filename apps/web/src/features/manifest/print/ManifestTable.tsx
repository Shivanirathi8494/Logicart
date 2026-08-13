"use client";

export default function ManifestTable({
  shipments,
}: any) {
  const actualRows = Array.isArray(shipments)
    ? shipments
    : [];

  // Always allow only TWO additional blank rows.
  const rows = [
    ...actualRows,
    null,
    null,
  ];

  return (
    <div className="mt-4 w-full font-sans text-[11px] leading-tight text-black">

      {/* COLUMN HEADERS */}
      <table
        className="w-full border-collapse border border-black"
        style={{ backgroundColor: "#fff" }}
      >
        <thead>
          <tr className="h-[44px]">
            <th className="w-[24%] border border-black bg-white px-2 text-left align-top font-bold">
              Airwaybill
            </th>

            <th className="w-[17%] border border-black bg-white px-2 text-left align-top font-bold">
              Number of Pcs
            </th>

            <th className="w-[17%] border border-black bg-white px-2 text-left align-top font-bold">
              Nature of
              <br />
              Goods
            </th>

            <th className="w-[17%] border border-black bg-white px-2 text-left align-top font-bold">
              Weight
            </th>

            <th className="w-[25%] border border-black bg-white px-2 text-left align-top font-bold">
              Origin/Destination
            </th>
          </tr>
        </thead>
      </table>

      {/* GAP BETWEEN HEADER AND DATA GRID */}
      <div className="h-[10mm]" />

      {/* DATA + TWO EXTRA BLANK ROWS */}
      <table
        className="w-full border-collapse border border-black"
        style={{ backgroundColor: "#fff" }}
      >
        <tbody>
          {rows.map((row: any, index: number) => {
            const shipment = row?.shipment;

            return (
              <tr
                key={index}
                className="h-[37px]"
                style={{ backgroundColor: "#fff" }}
              >
                <td
                  className="w-[24%] border border-black bg-white px-2 align-middle"
                >
                  {shipment?.trackingNumber ?? ""}
                </td>

                <td
                  className="w-[17%] border border-black bg-white px-2 align-middle"
                >
                  {shipment?.packageCount ?? ""}
                </td>

                <td
                  className="w-[17%] border border-black bg-white px-2 align-middle"
                >
                  {shipment?.contents ?? ""}
                </td>

                <td
                  className="w-[17%] border border-black bg-white px-2 align-middle"
                >
                  {shipment
                    ? Number(
                        shipment.chargeableWeight ?? 0
                      ).toFixed(2)
                    : ""}
                </td>

                <td
                  className="w-[25%] border border-black bg-white px-2 align-middle"
                >
                  {shipment
                    ? `${shipment.origin}/${shipment.destination}`
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}
