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

    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:items-center sm:p-6">

      <div className="my-3 max-h-[calc(100dvh-24px)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl sm:my-0 sm:max-h-[calc(100dvh-48px)]">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold text-[#0b2340] sm:text-2xl">

            {branch ? "Edit Branch" : "Add Branch"}

          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        <div className="grid gap-4 p-4 sm:gap-5 sm:p-6 md:grid-cols-2">

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
            Save
          </button>

        </div>

      </div>

    </div>

  );

}
