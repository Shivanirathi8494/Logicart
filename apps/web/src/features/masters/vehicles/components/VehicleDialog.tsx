"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  vehicle?: any;
};

export default function VehicleDialog({
  open,
  onClose,
  vehicle,
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">

            {vehicle ? "Edit Vehicle" : "Add Vehicle"}

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
            <label className="mb-2 block font-medium">Vehicle Number</label>
            <input defaultValue={vehicle?.vehicleNumber} className="w-full rounded-lg border p-3" />
          </div>

          <div>
            <label className="mb-2 block font-medium">Vehicle Type</label>
            <input defaultValue={vehicle?.vehicleType} className="w-full rounded-lg border p-3" />
          </div>

          <div>
            <label className="mb-2 block font-medium">Capacity</label>
            <input defaultValue={vehicle?.capacity} className="w-full rounded-lg border p-3" />
          </div>

          <div>
            <label className="mb-2 block font-medium">Driver Name</label>
            <input defaultValue={vehicle?.driverName} className="w-full rounded-lg border p-3" />
          </div>

          <div>
            <label className="mb-2 block font-medium">Driver Phone</label>
            <input defaultValue={vehicle?.driverPhone} className="w-full rounded-lg border p-3" />
          </div>

          <div>
            <label className="mb-2 block font-medium">Status</label>

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
            Save Vehicle
          </button>

        </div>

      </div>

    </div>

  );

}
