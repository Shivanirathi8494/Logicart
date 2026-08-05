import ReportCard from "./components/ReportCard";

export default function ReportsHomePage() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="mt-2 text-slate-500">
          View operational and financial reports.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <ReportCard
          title="Booking Report"
          description="View shipment booking reports."
          href="/portal/reports/booking"
        />

        <ReportCard
          title="Shipment Report"
          description="Track shipment movement."
          href="/portal/reports/shipment"
        />

        <ReportCard
          title="Manifest Report"
          description="View generated manifests."
          href="/portal/reports/manifest"
        />

        <ReportCard
          title="Delivery Challan Report"
          description="View delivery challans."
          href="/portal/reports/delivery-challan"
        />

        <ReportCard
          title="Revenue Report"
          description="Revenue and collections."
          href="/portal/reports/revenue"
        />

        <ReportCard
          title="Day End Report"
          description="Daily closing summary."
          href="/portal/reports/day-end"
        />

      </div>

    </div>

  );

}
