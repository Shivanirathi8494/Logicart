"use client";

import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

export default function SenderInformation({
  shipment,
  setShipment,
}: Props) {

  async function lookupPincode(pincode: string) {

    if (pincode.length !== 6) {

      setShipment(prev => ({
        ...prev,
        senderPincode: pincode,
        senderState: "",
        senderCity: "",
      }));

      return;

    }

    setShipment(prev => ({
      ...prev,
      senderPincode: pincode,
    }));

    try {

      const response = await fetch(
        "/api/pincode?pincode=" + pincode
      );

      if (!response.ok) return;

      const data = await response.json();

      setShipment(prev => ({
        ...prev,
        senderState: data.state,
        senderCity: data.city,
      }));

    } catch (error) {

      console.error(error);

    }

  }

  return (

    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

      <h2 className="mb-4 text-lg font-semibold text-[#0b2340] sm:mb-6 sm:text-xl">
        Shipper's Information
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">

        <input
          placeholder="Shipper's Name"
          className="min-h-11 w-full rounded-lg border p-3 text-base"
          value={shipment.senderName}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              senderName:e.target.value,
            }))
          }
        />

        <input
          placeholder="Mobile Number"
          className="min-h-11 w-full rounded-lg border p-3 text-base"
          value={shipment.senderPhone}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              senderPhone:e.target.value,
            }))
          }
        />

        <input
          placeholder="GSTIN"
          className="min-h-11 w-full rounded-lg border p-3 text-base uppercase"
          maxLength={15}
          value={shipment.senderGSTIN ?? ""}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              senderGSTIN:e.target.value.toUpperCase(),
            }))
          }
        />

        <input
          placeholder="Pincode"
          maxLength={6}
          className="min-h-11 w-full rounded-lg border p-3 text-base"
          value={shipment.senderPincode ?? ""}
          onChange={(e)=>
            lookupPincode(e.target.value.replace(/\D/g,""))
          }
        />

        
        <input
          type="text"
          placeholder="Invoice Number"
          value={shipment.invoiceNumber ?? ""}
          onChange={(e) =>
            setShipment((previous) => ({
              ...previous,
              invoiceNumber: e.target.value,
            }))
          }
          className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-3 text-base"
        />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Invoice Value"
          value={shipment.invoiceValue ?? ""}
          onChange={(e) =>
            setShipment((previous) => ({
              ...previous,
              invoiceValue: e.target.value,
            }))
          }
          className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-3 text-base"
        />

<input
          readOnly
          placeholder="State"
          className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
          value={shipment.senderState ?? ""}
        />

        <input
          readOnly
          placeholder="City"
          className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
          value={shipment.senderCity ?? ""}
        />

        <textarea
          rows={3}
          placeholder="Complete Address"
          className="w-full rounded-lg border p-3 text-base sm:col-span-2 lg:col-span-3"
          value={shipment.senderAddress}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              senderAddress:e.target.value,
            }))
          }
        />

      </div>

    </section>

  );

}
