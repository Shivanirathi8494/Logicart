import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";
import { Button } from "@/components/ui/button";

export default function TrackingPage() {
  return (
    <>
      <PageHero
        title="Track Your Shipment"
        subtitle="Enter your Tracking ID to view the latest shipment status."
      />

      <PageContainer>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold">
            Shipment Tracking
          </h2>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">

            <input
              type="text"
              placeholder="Example: LGT240801001"
              className="flex-1 rounded-lg border p-4"
            />

            <Button>
              Track Shipment
            </Button>

          </div>

        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">

          <div className="rounded-2xl border bg-white p-8 shadow-sm">

            <h3 className="mb-6 text-xl font-semibold">
              Shipment Details
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Tracking ID</span>
                <span className="font-medium">LGT240801001</span>
              </div>

              <div className="flex justify-between">
                <span>Origin</span>
                <span>Bangalore</span>
              </div>

              <div className="flex justify-between">
                <span>Destination</span>
                <span>Mumbai</span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-semibold text-green-600">
                  In Transit
                </span>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-8 shadow-sm">

            <h3 className="mb-6 text-xl font-semibold">
              Shipment Timeline
            </h3>

            <ul className="space-y-5">

              <li>✅ Shipment Booked</li>

              <li>✅ Picked Up</li>

              <li>✅ Reached Origin Hub</li>

              <li>🟢 In Transit</li>

              <li>⏳ Out For Delivery</li>

              <li>⬜ Delivered</li>

            </ul>

          </div>

        </div>

      </PageContainer>    </>
  );
}
