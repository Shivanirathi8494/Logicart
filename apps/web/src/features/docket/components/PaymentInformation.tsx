"use client";

import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

export default function PaymentInformation({
  shipment,
  setShipment,
}: Props) {

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Payment Information
      </h2>

      <div className="mx-auto max-w-xl rounded-xl border bg-slate-50 p-6">

        <h3 className="mb-6 text-lg font-semibold">
          Payment Summary
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span>Freight Charges</span>

            <div className="text-right">
              <span className="font-semibold">
                ₹ {shipment.freight.toFixed(2)}
              </span>

              {shipment.tariffError && (
                <p className="mt-1 max-w-xs text-sm font-medium text-red-600">
                  {shipment.tariffError}
                </p>
              )}
            </div>

          </div>

          <div className="flex justify-between">

            <span>GST (18%)</span>

            <span className="font-semibold">
              ₹ {shipment.gst.toFixed(2)}
            </span>

          </div>

          <hr />

          <div className="flex justify-between text-xl font-bold">

            <span>Total Amount</span>

            <span>
              ₹ {shipment.total.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

      <div className="mt-8 rounded-xl border bg-slate-50 p-6">

        <h3 className="mb-6 text-lg font-semibold">
          Scan & Pay (UPI)
        </h3>

        <div className="grid gap-8 lg:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              UPI ID
            </label>

            <input
              readOnly
              value="payments@logicarts.in"
              className="w-full rounded-lg border bg-white p-3"
            />

            <label className="mt-6 mb-2 block text-sm font-medium">
              Transaction Reference
            </label>

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Enter UPI Transaction ID"
              value={shipment.paymentReference}
              onChange={(e)=>
                setShipment(prev=>({
                  ...prev,
                  paymentReference:e.target.value,
                }))
              }
            />

          </div>

          <div className="flex items-center justify-center rounded-xl border bg-white p-8">

            <div className="text-center">

              <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-lg border-2 border-dashed bg-slate-100">

                QR CODE

              </div>

              <p className="mt-4 text-sm text-slate-500">
                QR will be generated automatically
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-8">

        <label className="mb-2 block text-sm font-medium">
          Remarks
        </label>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          value={shipment.remarks}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              remarks:e.target.value,
            }))
          }
        />

      </div>

    </section>

  );

}
