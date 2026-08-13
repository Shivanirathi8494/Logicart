"use client";

import StationSelect from "@/components/master/StationSelect";
import AirlineSelect from "@/components/master/AirlineSelect";
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

  function handleOriginChange(origin: string) {
    setShipment((prev) => ({
      ...prev,
      origin,
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

        <AirlineSelect
          value={shipment.airlineId}
          onChange={async (airlineId) => {
            setShipment((prev) => ({
              ...prev,
              airlineId,
              trackingNumber: "",
            }));

            if (!airlineId) {
              return;
            }

            try {
              const response = await fetch(
                "/api/dockets/next-awb?airlineId=" +
                  encodeURIComponent(airlineId),
              );

              if (!response.ok) {
                throw new Error("Unable to preview AWB");
              }

              const data = await response.json();

              setShipment((prev) => ({
                ...prev,
                airlineId,
                trackingNumber: data.trackingNumber,
              }));
            } catch (error) {
              console.error(error);
            }
          }}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Flight Number
          </label>

          <input
            type="text"
            placeholder="Enter flight number"
            className="w-full rounded-lg border p-3"
            value={shipment.flightNumber}
            onChange={(e)=>
              setShipment((prev)=>({
                ...prev,
                flightNumber: e.target.value.toUpperCase(),
              }))
            }
          />
        </div>

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
