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

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">

            {customer ? "Edit Customer" : "Add Customer"}

          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none"
          >
            ×
          </button>

        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

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

        <div className="flex justify-end gap-4 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Save Customer
          </button>

        </div>

      </div>

    </div>

  );

}
