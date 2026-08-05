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

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">

            {user ? "Edit User" : "Add User"}

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
            Save User
          </button>

        </div>

      </div>

    </div>

  );

}
