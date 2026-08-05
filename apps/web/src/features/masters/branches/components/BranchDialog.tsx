"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  branch?: any;
};

export default function BranchDialog({
  open,
  onClose,
  branch,
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">

            {branch ? "Edit Branch" : "Add Branch"}

          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Branch Code
            </label>

            <input
              defaultValue={branch?.code}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Branch Name
            </label>

            <input
              defaultValue={branch?.name}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <textarea
              defaultValue={branch?.address}
              className="w-full rounded-lg border p-3"
              rows={3}
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              defaultValue={branch?.phone}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              defaultValue={branch?.email}
              className="w-full rounded-lg border p-3"
            />

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
            Save
          </button>

        </div>

      </div>

    </div>

  );

}
