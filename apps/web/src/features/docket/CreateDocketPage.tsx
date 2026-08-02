"use client";

import { useState } from "react";
import CreateSuccessDialog from "./components/CreateSuccessDialog";
import ShipmentInformation from "./components/ShipmentInformation";
import SenderInformation from "./components/SenderInformation";
import ReceiverInformation from "./components/ReceiverInformation";
import ShipmentDetails from "./components/ShipmentDetails";
import PaymentInformation from "./components/PaymentInformation";

export default function CreateDocketPage() {
  const [successOpen, setSuccessOpen] = useState(false);

  const handleCreateDocket = () => {
    setSuccessOpen(true);
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Create Docket
        </h1>

        <p className="mt-2 text-slate-500">
          Enter shipment information to create a new docket.
        </p>
      </div>

      <ShipmentInformation />

      <SenderInformation />

      <ReceiverInformation />

      <ShipmentDetails />

      <PaymentInformation />

      <div className="flex justify-end gap-4 border-t pt-6">
        <button className="rounded-lg border px-6 py-3">
          Save Draft
        </button>

        <button
          className="rounded-lg bg-[#1877F2] px-6 py-3 text-white"
          onClick={handleCreateDocket}
        >
          Create Docket
        </button>
      </div>

      <CreateSuccessDialog
        open={successOpen}
        trackingNumber="BLR-DEL-260802-000001"
        onPreview={() => {
          window.open("/portal/docket/preview", "_blank");
        }}
        onPrint={() => {
          window.open("/portal/docket/preview", "_blank");
        }}
        onNew={() => {
          window.location.reload();
        }}
        onClose={() => {
          setSuccessOpen(false);
        }}
      />

    </div>
  );
}
