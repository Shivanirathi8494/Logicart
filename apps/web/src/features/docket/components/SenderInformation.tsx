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

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Sender Information
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">

        <input
          placeholder="Name"
          className="rounded-lg border p-3"
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
          className="rounded-lg border p-3"
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
          className="rounded-lg border p-3 uppercase"
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
          className="rounded-lg border p-3"
          value={shipment.senderPincode ?? ""}
          onChange={(e)=>
            lookupPincode(e.target.value.replace(/\D/g,""))
          }
        />

        <input
          readOnly
          placeholder="State"
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.senderState ?? ""}
        />

        <input
          readOnly
          placeholder="City"
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.senderCity ?? ""}
        />

        <textarea
          rows={3}
          placeholder="Complete Address"
          className="rounded-lg border p-3 lg:col-span-3"
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
