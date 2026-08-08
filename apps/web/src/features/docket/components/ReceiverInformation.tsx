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

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Receiver Information
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">

        <input
          placeholder="Name"
          className="rounded-lg border p-3"
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
          className="rounded-lg border p-3"
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
          className="rounded-lg border p-3 uppercase"
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
          className="rounded-lg border p-3"
          maxLength={6}
          value={shipment.receiverPincode ?? ""}
          onChange={(e)=>
            lookupPincode(e.target.value.replace(/\D/g,""))
          }
        />

        <input
          readOnly
          placeholder="State"
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.receiverState ?? ""}
        />

        <input
          readOnly
          placeholder="City"
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.receiverCity ?? ""}
        />

        <textarea
          rows={3}
          placeholder="Complete Address"
          className="rounded-lg border p-3 lg:col-span-3"
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
