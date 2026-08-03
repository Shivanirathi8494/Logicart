"use client";

import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  title: string;
  type: "sender" | "receiver";
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

export default function PartyInformation({
  title,
  type,
  shipment,
  setShipment,
}: Props) {

  const isSender = type === "sender";

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        {title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <input
          className="rounded-lg border p-3"
          placeholder="Name"
          value={isSender ? shipment.senderName : shipment.receiverName}
          onChange={(e) =>
            setShipment((prev) => ({
              ...prev,
              ...(isSender
                ? { senderName: e.target.value }
                : { receiverName: e.target.value }),
            }))
          }
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Mobile Number"
          value={isSender ? shipment.senderPhone : shipment.receiverPhone}
          onChange={(e) =>
            setShipment((prev) => ({
              ...prev,
              ...(isSender
                ? { senderPhone: e.target.value }
                : { receiverPhone: e.target.value }),
            }))
          }
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Address"
          value={isSender ? shipment.senderAddress : shipment.receiverAddress}
          onChange={(e) =>
            setShipment((prev) => ({
              ...prev,
              ...(isSender
                ? { senderAddress: e.target.value }
                : { receiverAddress: e.target.value }),
            }))
          }
        />

      </div>

    </section>
  );
}
