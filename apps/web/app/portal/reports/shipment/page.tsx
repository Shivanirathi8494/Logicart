import ReportLayout from "@/features/reports/components/ReportLayout";
import ReportSummary from "@/features/reports/components/ReportSummary";
import ReportTable from "@/features/reports/components/ReportTable";

export default function Page() {

  return (

    <ReportLayout title="Shipment Report">

      <ReportSummary
        cards={[
          {
            title:"Total Records",
            value:128,
          },
          {
            title:"Revenue",
            value:"₹8,45,000",
          },
          {
            title:"Weight",
            value:"4,280 Kg",
          },
          {
            title:"Completed",
            value:118,
          },
        ]}
      />

      <ReportTable
        headers={[
          "Reference",
          "Origin",
          "Destination",
          "Date",
          "Status",
        ]}
        rows={[
          [
            "REF000001",
            "DEL",
            "BLR",
            "04-Aug-2026",
            "Completed",
          ],
          [
            "REF000002",
            "DEL",
            "BOM",
            "04-Aug-2026",
            "Open",
          ],
        ]}
      />

    </ReportLayout>

  );

}
