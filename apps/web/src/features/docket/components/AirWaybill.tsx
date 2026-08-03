type Props = {
  trackingNumber: string;
};

export default function AirWaybill({
  trackingNumber,
}: Props) {
  return (
    <div className="mx-auto w-[210mm] min-h-[297mm] bg-white p-10 text-black">

      <div className="border-b pb-6">

        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              LOGICARTS
            </h1>

            <p className="text-lg">
              AIR WAYBILL
            </p>

          </div>

          <div className="rounded border border-dashed px-4 py-3 text-sm text-slate-500">
            Tracking ID
            <br />
            {trackingNumber}
          </div>

        </div>

      </div>

      <div className="mt-8">

        <p className="text-sm text-gray-500">
          Tracking Number
        </p>

        <h2 className="text-3xl font-bold">
          {trackingNumber}
        </h2>

        <div className="mt-5 rounded border border-dashed p-3 text-center text-sm text-slate-500">
          Barcode: {trackingNumber}
        </div>

      </div>

      <div className="mt-10 grid grid-cols-2 gap-8">

        <div className="rounded border p-4">

          <h3 className="mb-3 text-lg font-semibold">
            Sender
          </h3>

          <p>Name</p>
          <p>Phone</p>
          <p>Address</p>

        </div>

        <div className="rounded border p-4">

          <h3 className="mb-3 text-lg font-semibold">
            Receiver
          </h3>

          <p>Name</p>
          <p>Phone</p>
          <p>Address</p>

        </div>

      </div>

      <div className="mt-8 rounded border">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-slate-100">

              <th className="border p-3">Packages</th>
              <th className="border p-3">Actual Wt</th>
              <th className="border p-3">Volumetric</th>
              <th className="border p-3">Chargeable</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td className="border p-3">1</td>
              <td className="border p-3">10</td>
              <td className="border p-3">12</td>
              <td className="border p-3">12</td>

            </tr>

          </tbody>

        </table>

      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">

        <div className="rounded border p-4">

          Freight

        </div>

        <div className="rounded border p-4">

          GST

        </div>

        <div className="rounded border p-4">

          Total

        </div>

      </div>

      <div className="mt-12 grid grid-cols-2 gap-20">

        <div className="text-center">

          ____________________

          <br />

          Sender Signature

        </div>

        <div className="text-center">

          ____________________

          <br />

          Booking Executive

        </div>

      </div>

    </div>
  );
}
