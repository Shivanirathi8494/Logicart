"use client";

export default function PaymentInformation() {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Payment Information
      </h2>

      <div className="grid gap-6 md:grid-cols-3">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Freight Charges
          </label>

          <input
            readOnly
            value="2450"
            className="w-full rounded-lg border bg-slate-100 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            GST (18%)
          </label>

          <input
            readOnly
            value="441"
            className="w-full rounded-lg border bg-slate-100 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Total Amount
          </label>

          <input
            readOnly
            value="2891"
            className="w-full rounded-lg border bg-slate-100 p-3 font-semibold"
          />
        </div>

      </div>

      <div className="mt-10 rounded-xl border bg-slate-50 p-6">

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
              placeholder="Enter UPI Transaction ID"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div className="flex items-center justify-center rounded-xl border bg-white p-8">

            <div className="text-center">

              <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-lg border-2 border-dashed bg-slate-100 text-lg font-semibold text-slate-500">
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
          placeholder="Enter remarks..."
        />

      </div>

    </section>
  );
}
