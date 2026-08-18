import ReportLayout from "@/features/reports/components/ReportLayout";
import ReportSummary from "@/features/reports/components/ReportSummary";
import ReportTable from "@/features/reports/components/ReportTable";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/authorization";

export default async function Page() {

  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/portal/dashboard");
  }

  return (

    <ReportLayout title="Revenue Report">

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
