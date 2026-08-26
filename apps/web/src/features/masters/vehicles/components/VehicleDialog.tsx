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

    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:items-center sm:p-6">

      <div className="my-3 max-h-[calc(100dvh-24px)] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl sm:my-0 sm:max-h-[calc(100dvh-48px)]">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold text-[#0b2340] sm:text-2xl">

            {vehicle ? "Edit Vehicle" : "Add Vehicle"}

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
            Save Vehicle
          </button>

        </div>

      </div>

    </div>

  );

}
