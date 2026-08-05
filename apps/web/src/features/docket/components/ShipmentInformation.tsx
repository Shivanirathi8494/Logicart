"use client";

import StationSelect from "@/components/master/StationSelect";
import { CreateShipmentRequest } from "@/types/shipment";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

export default function ShipmentInformation({
  shipment,
  setShipment,
}: Props) {

  async function handleOriginChange(origin: string) {

    let trackingNumber = shipment.trackingNumber;

    if (!trackingNumber) {

      const response = await fetch(
        "/api/dockets/next-awb?origin=" +
        encodeURIComponent(origin)
      );

      if (response.ok) {

        const data = await response.json();

        trackingNumber = data.trackingNumber;

      }

    }

    setShipment((prev) => ({
      ...prev,
      origin,
      trackingNumber,
    }));

  }

  return (

    <section className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Shipment Information
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">

        <input
          type="date"
          className="rounded-lg border p-3"
          value={shipment.bookingDate}
          onChange={(e)=>
            setShipment((prev)=>({
              ...prev,
              bookingDate:e.target.value,
            }))
          }
        />

        <input
          readOnly
          className="rounded-lg border bg-slate-100 p-3"
          value={shipment.trackingNumber}
          placeholder="AWB Number"
        />

        <input
          placeholder="Customer Reference Number"
          className="rounded-lg border p-3"
        />

        <StationSelect
          label="Origin"
          value={shipment.origin}
          onChange={handleOriginChange}
        />

        <StationSelect
          label="Destination"
          value={shipment.destination}
          onChange={(destination)=>
            setShipment((prev)=>({
              ...prev,
              destination,
            }))
          }
        />

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Transport Mode
          </label>

          <input
            readOnly
            value="AIR"
            className="w-full rounded-lg border bg-slate-100 p-3 font-medium"
          />

        </div>

      </div>

    </section>

  );

}
