"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import PrintableAirWaybill from "./PrintableAirWaybill";

type Props = {
  trackingNumber: string;
};

export default function AirWaybill({
  trackingNumber,
}: Props) {

  const [shipment, setShipment] = useState<any>();

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trackingNumber) {
      loadShipment();
    }
  }, [trackingNumber]);

  async function loadShipment() {

    const response = await fetch(
      "/api/dockets/" + trackingNumber
    );

    if (!response.ok) {

      alert("Shipment not found");

      return;

    }

    const data = await response.json();

    setShipment(data);

  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: trackingNumber,
  });

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

      <div ref={printRef}>

        <PrintableAirWaybill
          shipment={shipment}
        />

      </div>

    </div>

  );

}
