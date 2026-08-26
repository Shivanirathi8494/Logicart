"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  customer?: any;
};

export default function CustomerDialog({
  open,
  onClose,
  customer,
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:items-center sm:p-6">

      <div className="my-3 max-h-[calc(100dvh-24px)] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl sm:my-0 sm:max-h-[calc(100dvh-48px)]">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold text-[#0b2340] sm:text-2xl">

            {customer ? "Edit Customer" : "Add Customer"}

          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none"
          >
            ×
          </button>

        </div>

        <div className="grid gap-4 p-4 sm:gap-5 sm:p-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Customer Code
            </label>

            <input
              defaultValue={customer?.customerCode}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Customer Name
            </label>

            <input
              defaultValue={customer?.name}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Contact Person
            </label>

            <input
              defaultValue={customer?.contactPerson}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              GST Number
            </label>

            <input
              defaultValue={customer?.gst}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Phone
            </label>

            <input
              defaultValue={customer?.phone}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              defaultValue={customer?.email}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium">
              Billing Address
            </label>

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium">
              Pickup Address
            </label>

            <textarea
              rows={3}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Status
            </label>

            <select className="w-full rounded-lg border p-3">

              <option>ACTIVE</option>

              <option>INACTIVE</option>

            </select>

          </div>

        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t bg-white p-4 sm:flex-row sm:justify-end sm:gap-4 sm:p-6">

          <button
            onClick={onClose}
            className="min-h-11 w-full rounded-lg border px-6 py-3 font-semibold sm:w-auto"
          >
            Cancel
          </button>

          <button
            className="min-h-11 w-full rounded-lg bg-[#1877F2] px-6 py-3 font-semibold text-white sm:w-auto"
          >
            Save Customer
          </button>

        </div>

      </div>

    </div>

  );

}
