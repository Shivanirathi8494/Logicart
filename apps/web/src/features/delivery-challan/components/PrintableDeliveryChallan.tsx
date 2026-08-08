"use client";

import Image from "next/image";

export default function PrintableDeliveryChallan({
  challan,
}: {
  challan: any;
}) {

  const rows = challan.shipments ?? [];

  return (

    <div className="mx-auto w-[210mm] min-h-[297mm] bg-white p-6 text-black">

      <table className="w-full border-collapse border border-black">

        <tbody>

          <tr>

            <td
              colSpan={4}
              className="border border-black p-3"
            >

              <div className="flex items-center justify-between">

                <Image
                  src="/logo/logicarts-logo.png"
                  alt="Logicarts"
                  width={120}
                  height={40}
                />

                <div className="text-center">

                  <h1 className="text-2xl font-bold">
                    DELIVERY CHALLAN
                  </h1>

                </div>

                <div className="text-right text-sm">

                  <div>

                    <strong>No :</strong>{" "}
                    {challan.challanNumber}

                  </div>

                  <div>

                    <strong>Date :</strong>{" "}
                    {new Date(
                      challan.challanDate
                    ).toLocaleDateString()}

                  </div>

                </div>

              </div>

            </td>

          </tr>

          <tr>

            <td
              colSpan={4}
              className="border border-black p-3"
            >

              Please deliver to M/s.&nbsp;

              <strong>

                {challan.customerName}

              </strong>

            </td>

          </tr>

          <tr>

            <td
              colSpan={2}
              className="border border-black p-3"
            >

              <strong>Flight No :</strong>{" "}

              {challan.flightNumber || "-"}

            </td>

            <td
              colSpan={2}
              className="border border-black p-3"
            >

              <strong>Vehicle :</strong>{" "}

              {challan.vehicleNumber || "-"}

            </td>

          </tr>

          <tr className="bg-gray-100">

            <th className="border border-black p-2">
              AWB No.
            </th>

            <th className="border border-black p-2">
              No. of Pkgs.
            </th>

            <th className="border border-black p-2">
              Weight
            </th>

            <th className="border border-black p-2">
              Description
            </th>

          </tr>

          {rows.map((item: any) => (

            <tr key={item.id}>

              <td className="border border-black p-2">

                {item.shipment.trackingNumber}

              </td>

              <td className="border border-black p-2 text-center">

                {item.shipment.packageCount}

              </td>

              <td className="border border-black p-2 text-center">

                {item.shipment.chargeableWeight}

              </td>

              <td className="border border-black p-2">

                {item.shipment.contents || "-"}

              </td>

            </tr>

          ))}

          {Array.from({
            length: Math.max(
              0,
              18 - rows.length,
            ),
          }).map((_, i) => (

            <tr key={i}>

              <td className="border border-black h-8"></td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>

              <td className="border border-black"></td>

            </tr>

          ))}

          <tr>

            <td
              colSpan={2}
              className="border border-black p-6 align-top"
            >

              <div className="mt-12 border-t border-black"></div>

              <div className="mt-2">

                Receiver Signature

              </div>

              <div className="text-sm">

                Name / Date / Time

              </div>

            </td>

            <td
              colSpan={2}
              className="border border-black p-6 align-top text-right"
            >

              <div className="mt-12 border-t border-black"></div>

              <div className="mt-2">

                For Logicarts

              </div>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  );

}
