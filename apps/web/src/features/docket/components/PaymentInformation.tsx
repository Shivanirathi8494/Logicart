"use client";

import {
  CreateShipmentRequest,
} from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;

  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

function money(
  value: number | undefined,
) {
  return `₹ ${Number(value || 0).toFixed(2)}`;
}

export default function PaymentInformation({
  shipment,
  setShipment,
}: Props) {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#0b2340] sm:mb-6 sm:text-xl">
        Charges & Additional Information
      </h2>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 sm:mb-8">
        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Freight
          </div>

          <div className="mt-2 text-xl font-semibold">
            {money(shipment.freight)}
          </div>
        </div>

        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            GST / Tax
          </div>

          <div className="mt-2 text-xl font-semibold">
            {money(shipment.gst)}
          </div>
        </div>

        <div className="rounded-lg border bg-slate-900 p-4 text-white">
          <div className="text-sm text-slate-300">
            Total Amount
          </div>

          <div className="mt-2 text-xl font-bold">
            {money(shipment.total)}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Remarks
        </label>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3 text-base"
          value={shipment.remarks ?? ""}
          onChange={(event) =>
            setShipment((previous) => ({
              ...previous,
              remarks:
                event.target.value,
            }))
          }
          placeholder="Enter shipment remarks if required"
        />
      </div>
    </section>
  );
}
