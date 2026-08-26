"use client";

export default function PrintableDeliveryChallan({
  challan,
}: {
  challan: any;
}) {
  const actualRows = Array.isArray(challan?.shipments) ? challan.shipments : [];

  // Only two blank rows after the actual AWBs.
  const rows = [...actualRows, null, null];

  const firstShipment = actualRows[0]?.shipment;

  return (
    <div
      className="mx-auto min-h-[297mm] w-[210mm] bg-white p-[10mm] text-black"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <table
        className="w-full border-collapse border border-black text-[12px]"
        style={{ backgroundColor: "#ffffff" }}
      >
        <tbody>
          {/* HEADER */}
          <tr>
            <td colSpan={4} className="border border-black px-4 py-4">
              <div className="relative flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[28px] font-bold">DELIVERY CHALLAN</div>
                </div>

                <div className="absolute right-0 top-0 text-right text-[13px]">
                  <div>
                    <strong>No :</strong> {challan.challanNumber}
                  </div>

                  <div className="mt-1">
                    <strong>Date :</strong>{" "}
                    {new Date(challan.challanDate).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>
            </td>
          </tr>

          {/* AIRPORT VENDOR HANDOVER */}
          <tr>
            <td colSpan={4} className="border border-black px-4 py-4">
              <div className="mb-3 text-[14px] font-bold">
                AIRPORT DELIVERY / VENDOR HANDOVER
              </div>

              <div className="grid grid-cols-[130px_1fr] gap-y-2 text-[13px]">
                <strong>Vendor Name :</strong>
                <span>{challan.customerName || "-"}</span>

                <strong>Vendor Phone :</strong>
                <span>{challan.customerPhone || "-"}</span>

                <strong>Vendor Address :</strong>
                <span>{challan.customerAddress || "-"}</span>
              </div>
            </td>
          </tr>

          {/* HANDOVER INFORMATION */}
          <tr>
            <td
              colSpan={2}
              className="border border-black px-4 py-4 text-[14px]"
            >
              Route : <strong>{firstShipment?.origin || "-"}</strong>
              <span className="mx-2">→</span>
              <strong>{firstShipment?.destination || "-"}</strong>
            </td>

            <td
              colSpan={2}
              className="border border-black px-4 py-4 text-[14px]"
            >
              Handover Date :{" "}
              <strong>
                {new Date(challan.challanDate).toLocaleDateString("en-GB")}
              </strong>
            </td>
          </tr>

          {/* TABLE HEADER */}
          <tr>
            <th className="border border-black bg-white px-3 py-3 text-left font-bold">
              Consignment Note No.
            </th>

            <th className="border border-black bg-white px-3 py-3 text-center font-bold">
              No. of Pkgs.
            </th>

            <th className="border border-black bg-white px-3 py-3 text-center font-bold">
              Weight
            </th>

            <th className="border border-black bg-white px-3 py-3 text-left font-bold">
              Description
            </th>
          </tr>

          {/* AWB ROWS + 2 BLANK ROWS */}
          {rows.map((item: any, index: number) => {
            const shipment = item?.shipment;

            return (
              <tr
                key={index}
                className="h-[38px]"
                style={{
                  backgroundColor: "#ffffff",
                }}
              >
                <td className="border border-black bg-white px-3">
                  {shipment?.trackingNumber ?? ""}
                </td>

                <td className="border border-black bg-white px-3 text-center">
                  {shipment?.packageCount ?? ""}
                </td>

                <td className="border border-black bg-white px-3 text-center">
                  {shipment
                    ? Number(shipment.chargeableWeight ?? 0).toFixed(2)
                    : ""}
                </td>

                <td className="border border-black bg-white px-3">
                  {shipment?.contents ?? ""}
                </td>
              </tr>
            );
          })}

          {/* SIGNATURE */}
          <tr>
            <td
              colSpan={2}
              className="border border-black px-4 py-8 align-bottom"
            >
              <div className="mt-12">Vendor / Receiver Signature</div>

              <div className="mt-4">Name / Mobile / Date / Time</div>
            </td>

            <td
              colSpan={2}
              className="border border-black px-4 py-8 text-right align-bottom"
            >
              <div className="mt-12">For ALLIANCE AIR</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
