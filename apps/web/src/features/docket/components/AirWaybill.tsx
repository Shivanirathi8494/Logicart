"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const PdfViewer = dynamic(
  () =>
    import("@react-pdf-viewer/core").then((mod) => {
      const { Worker, Viewer } = mod;

      return function PdfViewerComponent({
        fileUrl,
      }: {
        fileUrl: string;
      }) {
        return (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} />
          </Worker>
        );
      };
    }),
  { ssr: false },
);

type Props = {
  trackingNumber: string;
};

export default function AirWaybill({
  trackingNumber,
}: Props) {
  const [shipment, setShipment] = useState<any>();

  useEffect(() => {
    if (trackingNumber) {
      loadShipment();
    }
  }, [trackingNumber]);

  async function loadShipment() {
    const response = await fetch(
      "/api/dockets/" + encodeURIComponent(trackingNumber),
    );

    if (!response.ok) {
      alert("Shipment not found");
      return;
    }

    const data = await response.json();
    setShipment(data);
  }

  function handlePrint() {
    window.open(
      `/api/airwaybill/${encodeURIComponent(trackingNumber)}`,
      "_blank",
    );
  }

  if (!trackingNumber) {
    return (
      <div className="p-10 text-center">
        No AWB Number supplied.
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="p-10 text-center">
        Loading Air Waybill...
      </div>
    );
  }

  const pdfUrl = `/api/airwaybill/${encodeURIComponent(
    shipment.trackingNumber,
  )}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Print
        </button>

        <button
          onClick={() => window.history.back()}
          className="rounded-lg border px-6 py-3"
        >
          Back
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-slate-200 shadow-sm">
        <div className="min-h-[900px]">
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      </div>
    </div>
  );
}
