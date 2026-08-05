import ReportLayout from "@/features/reports/components/ReportLayout";
import ReportSummary from "@/features/reports/components/ReportSummary";
import ReportTable from "@/features/reports/components/ReportTable";

export default function Page() {

  return (

    <ReportLayout title="Booking Report">

      <ReportSummary

        cards={[

          {
            title:"Total Bookings",
            value:128,
          },

          {
            title:"Revenue",
            value:"₹8,45,000",
          },

          {
            title:"Total Weight",
            value:"4,280 Kg",
          },

          {
            title:"Delivered",
            value:118,
          },

        ]}

      />

      <ReportTable

        headers={[

          "Tracking No",

          "Origin",

          "Destination",

          "Customer",

          "Weight",

          "Amount",

          "Status",

        ]}

        rows={[

          [

            "DEL000001",

            "DEL",

            "BLR",

            "ABC Traders",

            "50 Kg",

            "₹5,000",

            "Delivered",

          ],

          [

            "DEL000002",

            "DEL",

            "BOM",

            "XYZ Electronics",

            "80 Kg",

            "₹8,200",

            "In Transit",

          ],

        ]}

      />

    </ReportLayout>

  );

}
