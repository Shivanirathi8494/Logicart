"use client";

type Props = {
  title: string;
  children?: React.ReactNode;
};

export default function ReportLayout({
  title,
  children,
}: Props) {

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="mt-2 text-slate-500">
            Generate and export reports.
          </p>

        </div>

        <div className="flex gap-3">

          <button
            className="rounded-lg border px-5 py-3"
          >
            Print
          </button>

          <button
            className="rounded-lg bg-green-600 px-5 py-3 text-white"
          >
            Export Excel
          </button>

        </div>

      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="grid gap-4 md:grid-cols-4">

          <input
            type="date"
            className="rounded-lg border p-3"
          />

          <input
            type="date"
            className="rounded-lg border p-3"
          />

          <select
            className="rounded-lg border p-3"
          >
            <option>All Branches</option>
            <option>BLR</option>
            <option>DEL</option>
            <option>BOM</option>
          </select>

          <select
            className="rounded-lg border p-3"
          >
            <option>All Status</option>
            <option>OPEN</option>
            <option>CLOSED</option>
            <option>DELIVERED</option>
          </select>

        </div>

        <div className="mt-4 flex gap-3">

          <button
            className="rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Search
          </button>

          <button
            className="rounded-lg border px-6 py-3"
          >
            Reset
          </button>

        </div>

      </div>

      {children}

    </div>

  );

}
