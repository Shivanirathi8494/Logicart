"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";

function TrackingContent() {

  const searchParams = useSearchParams();

  const [trackingNumber, setTrackingNumber] = useState(
    searchParams.get("trackingNumber") ?? ""
  );

  const [shipment, setShipment] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function search() {

    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError("");
    setShipment(null);

    const response = await fetch(
      "/api/dockets/" +
      encodeURIComponent(trackingNumber) +
      "/status"
    );

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {

      setError(data.error ?? "Shipment not found.");

      return;

    }

    setShipment(data);

  }

  useEffect(() => {

    if (trackingNumber) {

      search();

    }

  }, []);

  return (
    <>
      <PageHero
        title="Track Your Shipment"
        subtitle="Enter your Tracking ID to view the latest shipment status."
      />

      <PageContainer>

        <div className="rounded-2xl border bg-white p-8 shadow">

          <div className="flex flex-col gap-4 md:flex-row">

            <input
              value={trackingNumber}
              onChange={(e)=>setTrackingNumber(e.target.value.toUpperCase())}
              className="flex-1 rounded-lg border p-4"
              placeholder="AWB Number"
            />

            <button
              onClick={search}
              className="rounded-lg bg-blue-600 px-8 py-4 text-white"
            >
              {loading ? "Searching..." : "Track Shipment"}
            </button>

          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {shipment && (

            <div className="mt-8 rounded-xl border p-8">

              <h2 className="mb-6 text-2xl font-bold">
                Shipment Details
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <strong>AWB Number</strong>
                  <br />
                  {shipment.trackingNumber}
                </div>

                <div>
                  <strong>Status</strong>
                  <br />
                  {shipment.status}
                </div>

                <div>
                  <strong>Origin</strong>
                  <br />
                  {shipment.origin}
                </div>

                <div>
                  <strong>Destination</strong>
                  <br />
                  {shipment.destination}
                </div>

                <div>
                  <strong>Sender</strong>
                  <br />
                  {shipment.senderName}
                </div>

                <div>
                  <strong>Receiver</strong>
                  <br />
                  {shipment.receiverName}
                </div>

                <div>
                  <strong>Booking Date</strong>
                  <br />
                  {new Date(shipment.bookingDate).toLocaleDateString()}
                </div>

                <div>
                  <strong>Total</strong>
                  <br />
                  ₹ {shipment.total}
                </div>

              </div>

            </div>

          )}

        </div>

      </PageContainer>
    </>
  );
}


export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
