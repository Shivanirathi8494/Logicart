"use client";

import { useState } from "react";

import { createShipment } from "@/lib/api/docket";
import { initialShipment } from "@/lib/docket/initialShipment";

import CreateSuccessDialog from "./components/CreateSuccessDialog";
import ShipmentInformation from "./components/ShipmentInformation";
import SenderInformation from "./components/SenderInformation";
import ReceiverInformation from "./components/ReceiverInformation";
import ShipmentDetails from "./components/ShipmentDetails";
import PaymentInformation from "./components/PaymentInformation";

export default function CreateDocketPage() {

  const [shipment, setShipment] = useState(initialShipment);

  const [loading, setLoading] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [createdTrackingNumber, setCreatedTrackingNumber] = useState("");

  async function handleCreateDocket() {

    try {

      setLoading(true);

      const response = await createShipment(shipment);

      setCreatedTrackingNumber(response.trackingNumber);

      setSuccessOpen(true);

      setShipment(initialShipment);

    } catch (error) {

      console.error(error);

      alert("Unable to create shipment");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Create Docket

        </h1>

        <p className="mt-2 text-slate-500">

          Enter shipment information to create a new shipment.

        </p>

      </div>

      <ShipmentInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <SenderInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <ReceiverInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <ShipmentDetails
        shipment={shipment}
        setShipment={setShipment}
      />

      <PaymentInformation
        shipment={shipment}
        setShipment={setShipment}
      />

      <div className="flex justify-end gap-4 border-t pt-6">

        <button
          className="rounded-lg border px-6 py-3"
        >
          Save Draft
        </button>

        <button
          onClick={handleCreateDocket}
          disabled={loading}
          className="rounded-lg bg-[#1877F2] px-6 py-3 text-white disabled:opacity-50"
        >

          {loading ? "Creating..." : "Create Docket"}

        </button>

      </div>

      <CreateSuccessDialog

        open={successOpen}

        trackingNumber={createdTrackingNumber}

        onPreview={() => {

          window.open("/portal/docket/preview","_blank");

        }}

        onPrint={() => {

          window.open("/portal/docket/preview","_blank");

        }}

        onNew={() => {

          setSuccessOpen(false);

        }}

        onClose={() => {

          setSuccessOpen(false);

        }}

      />

    </div>

  );

}
