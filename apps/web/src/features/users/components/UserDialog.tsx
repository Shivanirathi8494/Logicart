"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  user?: any;
};

export default function UserDialog({
  open,
  onClose,
  user,
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:items-center sm:p-6">

      <div className="my-3 max-h-[calc(100dvh-24px)] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl sm:my-0 sm:max-h-[calc(100dvh-48px)]">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold text-[#0b2340] sm:text-2xl">

            {user ? "Edit User" : "Add User"}

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
              Full Name
            </label>

            <input
              defaultValue={user?.name}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Username
            </label>

            <input
              defaultValue={user?.username}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              defaultValue={user?.email}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Phone
            </label>

            <input
              defaultValue={user?.phone}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Role
            </label>

            <select className="w-full rounded-lg border p-3">

              <option>Administrator</option>
              <option>Booking</option>
              <option>Warehouse</option>
              <option>Delivery</option>
              <option>Accounts</option>

            </select>

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
            Save User
          </button>

        </div>

      </div>

    </div>

  );

}
