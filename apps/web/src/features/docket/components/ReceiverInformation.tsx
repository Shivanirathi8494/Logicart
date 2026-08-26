"use client";

import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

export default function ReceiverInformation({
  shipment,
  setShipment,
}: Props) {

  async function lookupPincode(pincode: string) {

    if (pincode.length !== 6) {

      setShipment(prev => ({
        ...prev,
        receiverPincode: pincode,
        receiverState: "",
        receiverCity: "",
      }));

      return;

    }

    setShipment(prev => ({
      ...prev,
      receiverPincode: pincode,
    }));

    try {

      const response = await fetch(
        "/api/pincode?pincode=" + pincode
      );

      if (!response.ok) return;

      const data = await response.json();

      setShipment(prev => ({
        ...prev,
        receiverState: data.state,
        receiverCity: data.city,
      }));

    } catch (error) {

      console.error(error);

    }

  }

  return (

    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

      <h2 className="mb-4 text-lg font-semibold text-[#0b2340] sm:mb-6 sm:text-xl">
        Consignee's Information
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">

        <input
          placeholder="Consignee's Name"
          className="min-h-11 w-full rounded-lg border p-3 text-base"
          value={shipment.receiverName}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              receiverName:e.target.value,
            }))
          }
        />

        <input
          placeholder="Mobile Number"
          className="min-h-11 w-full rounded-lg border p-3 text-base"
          value={shipment.receiverPhone}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              receiverPhone:e.target.value,
            }))
          }
        />

        <input
          placeholder="GSTIN"
          className="min-h-11 w-full rounded-lg border p-3 text-base uppercase"
          maxLength={15}
          value={shipment.receiverGSTIN ?? ""}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              receiverGSTIN:e.target.value.toUpperCase(),
            }))
          }
        />

        <input
          placeholder="Pincode"
          className="min-h-11 w-full rounded-lg border p-3 text-base"
          maxLength={6}
          value={shipment.receiverPincode ?? ""}
          onChange={(e)=>
            lookupPincode(e.target.value.replace(/\D/g,""))
          }
        />

        <input
          readOnly
          placeholder="State"
          className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
          value={shipment.receiverState ?? ""}
        />

        <input
          readOnly
          placeholder="City"
          className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
          value={shipment.receiverCity ?? ""}
        />

        <textarea
          rows={3}
          placeholder="Complete Address"
          className="w-full rounded-lg border p-3 text-base sm:col-span-2 lg:col-span-3"
          value={shipment.receiverAddress}
          onChange={(e)=>
            setShipment(prev=>({
              ...prev,
              receiverAddress:e.target.value,
            }))
          }
        />

      </div>

    </section>

  );

}
