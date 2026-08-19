"use client";

import { useEffect, useRef, useState } from "react";

import StationSelect from "@/components/master/StationSelect";
import AirlineSelect from "@/components/master/AirlineSelect";
import { CreateShipmentRequest } from "@/types/shipment";

import CustomerSelect, {
  Customer,
} from "./CustomerSelect";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<
    React.SetStateAction<CreateShipmentRequest>
  >;
};

type FlightSchedule = {
  id: string;
  airlineId: string;
  airlineName: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  aircraftType?: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
};

function displayDateTime(value: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("en-IN");
}

export default function ShipmentInformation({
  shipment,
  setShipment,
}: Props) {
  const [schedules, setSchedules] =
    useState<FlightSchedule[]>([]);

  const [loadingFlights, setLoadingFlights] =
    useState(false);

  const [flightSearchCompleted, setFlightSearchCompleted] =
    useState(false);

  const [flightStatusMessage, setFlightStatusMessage] =
    useState("");



  const flightRequestRef =
    useRef<AbortController | null>(null);

  const flightRequestIdRef =
    useRef(0);


  async function findFlights(
    origin: string,
    destination: string,
    bookingDate: string,
    airlineId: string,
  ) {
    const requestId =
      ++flightRequestIdRef.current;

    if (
      !origin ||
      !destination ||
      !bookingDate ||
      !airlineId
    ) {
      return;
    }

    try {
      setLoadingFlights(true);
      setFlightSearchCompleted(false);
      setFlightStatusMessage("Checking available flights...");

      const params = new URLSearchParams({
        origin,
        destination,
        date: bookingDate,
        airlineId,
      });

      flightRequestRef.current?.abort();

      const controller =
        new AbortController();

      flightRequestRef.current =
        controller;

      const response = await fetch(
        `/api/flights/schedules?${params.toString()}`,
        {
          signal: controller.signal,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load flights.",
        );
      }

      if (
        requestId !==
        flightRequestIdRef.current
      ) {
        return;
      }

      /*
       * Some flight API branches historically returned
       * `schedules`, while newer branches return `flights`.
       * Accept both, then enforce the selected airline.
       */
      const rawFlights =
        data.flights ??
        data.schedules ??
        [];

      const available =
        rawFlights.filter(
          (schedule: FlightSchedule) =>
            schedule.airlineId === airlineId
        );

      setSchedules(available);
      setFlightSearchCompleted(true);

      setFlightStatusMessage(
        available.length > 0
          ? `${available.length} flight(s) available`
          : "No flights available for the selected airline, route and booking date."
      );

      if (data.configured === false) {
        setFlightStatusMessage(
          data.message ||
            "Live flight schedule service is not configured."
        );
      }
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error(error);

      setSchedules([]);
      setFlightSearchCompleted(true);
      setFlightStatusMessage(
        "Unable to load flight schedules."
      );
    } finally {
      if (
        requestId ===
        flightRequestIdRef.current
      ) {
        setLoadingFlights(false);
      }
    }
  }

  function selectCustomer(customer: Customer | null) {
    setShipment((previous) => ({
      ...previous,

      customerId: customer?.id ?? "",

      senderName:
        customer?.name ??
        previous.senderName,

      senderPhone:
        customer?.phone ??
        previous.senderPhone,

      senderGSTIN:
        customer?.gstNumber ??
        previous.senderGSTIN,

      senderCity:
        customer?.city ??
        previous.senderCity,

      senderState:
        customer?.state ??
        previous.senderState,

      senderAddress:
        customer?.address ??
        previous.senderAddress,
    }));
  }

  /*
   * Automatically look up scheduled flights whenever
   * booking date, route or airline changes.
   *
   * The API receives airlineId, so only flights belonging
   * to the selected airline should be returned.
   */
  useEffect(() => {
    // Cancel and remove anything belonging to the
    // previously selected route/airline immediately.
    flightRequestRef.current?.abort();

    setSchedules([]);
    setFlightSearchCompleted(false);
    setFlightStatusMessage("");

    if (
      !shipment.bookingDate ||
      !shipment.origin ||
      !shipment.destination ||
      !shipment.airlineId
    ) {
      setLoadingFlights(false);
      return;
    }

    setLoadingFlights(true);
    setFlightStatusMessage(
      "Checking available flights..."
    );

    const timer = window.setTimeout(() => {
      void findFlights(
        shipment.origin,
        shipment.destination,
        shipment.bookingDate,
        shipment.airlineId,
      );
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    shipment.bookingDate,
    shipment.origin,
    shipment.destination,
    shipment.airlineId,
  ]);

  function clearSelectedFlight() {
    setSchedules([]);
              setFlightSearchCompleted(false);
              setFlightStatusMessage("");

    setShipment((previous) => ({
      ...previous,
      flightNumber: "",
      scheduledDeparture: "",
      scheduledArrival: "",
      aircraftType: "",
      departureTerminal: "",
      arrivalTerminal: "",
    }));
  }

  function selectFlight(scheduleId: string) {
    const selected =
      schedules.find(
        (schedule) => schedule.id === scheduleId,
      );

    if (!selected) {
      return;
    }

    setShipment((previous) => ({
      ...previous,

      airlineId:
        selected.airlineId,

      flightNumber:
        selected.flightNumber,

      scheduledDeparture:
        selected.scheduledDeparture,

      scheduledArrival:
        selected.scheduledArrival,

      aircraftType:
        selected.aircraftType ?? "",

      departureTerminal:
        selected.departureTerminal ?? "",

      arrivalTerminal:
        selected.arrivalTerminal ?? "",

      trackingNumber: "",
    }));
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Shipment Information
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Booking Date *
          </label>

          <input
            required
            type="date"
            className="w-full rounded-lg border p-3"
            value={shipment.bookingDate ?? ""}
            onChange={(event) =>
              setShipment((previous) => ({
                ...previous,
                bookingDate: event.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            AWB Number
          </label>

          <input
            readOnly
            className="w-full rounded-lg border bg-slate-100 p-3"
            value={shipment.trackingNumber ?? ""}
            placeholder="Generated after flight/airline selection"
          />
        </div>


        <CustomerSelect
          value={shipment.customerId ?? ""}
          onChange={selectCustomer}
        />

        <StationSelect
          label="Origin"
          value={shipment.origin ?? ""}
          onChange={(origin) =>
            setShipment((previous) => ({
              ...previous,
              origin,
              flightNumber: "",
              scheduledDeparture: "",
              scheduledArrival: "",
            }))
          }
        />

        <StationSelect
          label="Destination"
          value={shipment.destination ?? ""}
          onChange={(destination) =>
            setShipment((previous) => ({
              ...previous,
              destination,
              flightNumber: "",
              scheduledDeparture: "",
              scheduledArrival: "",
            }))
          }
        />

        <div>
          <AirlineSelect
            value={shipment.airlineId ?? ""}
            onChange={async (airlineId) => {
              setShipment((previous) => ({
                ...previous,

                airlineId,

                // Airline changed: previous flight selection
                // is no longer valid.
                flightNumber: "",
                scheduledDeparture: "",
                scheduledArrival: "",
                aircraftType: "",
                departureTerminal: "",
                arrivalTerminal: "",
                trackingNumber: "",
              }));

              // Immediately cancel any lookup belonging
              // to the previously selected airline.
              flightRequestRef.current?.abort();

              // Immediately remove flights belonging to
              // the previously selected airline.
              setSchedules([]);
              setFlightSearchCompleted(false);
              setFlightStatusMessage("");

              if (!airlineId) {
                return;
              }

              try {
                const response =
                  await fetch(
                    "/api/dockets/next-awb?airlineId=" +
                      encodeURIComponent(
                        airlineId,
                      ),
                  );

                if (!response.ok) {
                  throw new Error(
                    "Unable to preview AWB",
                  );
                }

                const data =
                  await response.json();

                setShipment(
                  (previous) => ({
                    ...previous,
                    airlineId,
                    trackingNumber:
                      data.trackingNumber ??
                      "",
                  }),
                );
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </div>


        <ReadOnlyField
          label="Transport Mode"
          value="AIR"
        />

{flightStatusMessage && (
  <div
    className={`lg:col-span-3 rounded-lg border px-4 py-3 text-sm ${
      loadingFlights
        ? "border-slate-200 bg-slate-50 text-slate-700"
        : schedules.length === 0
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
    }`}
  >
    {flightStatusMessage}
  </div>
)}



{!loadingFlights &&
  flightSearchCompleted &&
  schedules.length > 0 && (



        <div className="lg:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Available Flight
          </label>

          <select
            disabled={loadingFlights}
            value={
              schedules.find(
                (schedule) =>
                  schedule.flightNumber ===
                  shipment.flightNumber,
              )?.id ?? ""
            }
            onChange={(event) =>
              selectFlight(event.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              {loadingFlights
                ? "Loading available flights..."
                : "Select Flight"}
            </option>

            {schedules.map((schedule) => (
              <option
                key={schedule.id}
                value={schedule.id}
              >
                {schedule.flightNumber} |{" "}
                {displayDateTime(
                  schedule.scheduledDeparture,
                )}
              </option>
            ))}
          </select>
        </div>
)}


        {shipment.flightNumber && (
          <>
        <ReadOnlyField
          label="Flight Number"
          value={shipment.flightNumber ?? ""}
        />

        <ReadOnlyField
          label="Scheduled Departure"
          value={displayDateTime(
            shipment.scheduledDeparture,
          )}
        />

        <ReadOnlyField
          label="Scheduled Arrival"
          value={displayDateTime(
            shipment.scheduledArrival,
          )}
        />

        <ReadOnlyField
          label="Aircraft"
          value={shipment.aircraftType ?? ""}
        />

        <ReadOnlyField
          label="Departure Terminal"
          value={shipment.departureTerminal ?? ""}
        />

        <ReadOnlyField
          label="Arrival Terminal"
          value={shipment.arrivalTerminal ?? ""}
        />
          </>
        )}

        {shipment.aircraftType &&
          shipment.aircraftType !== "TBD" && (
            <ReadOnlyField
              label="Aircraft"
              value={shipment.aircraftType}
            />
          )}

        {shipment.departureTerminal && (
          <ReadOnlyField
            label="Departure Terminal"
            value={shipment.departureTerminal}
          />
        )}

        {shipment.arrivalTerminal && (
          <ReadOnlyField
            label="Arrival Terminal"
            value={shipment.arrivalTerminal}
          />
        )}


      </div>
    </section>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        readOnly
        value={value ?? ""}
        className="w-full rounded-lg border bg-slate-100 p-3"
      />
    </div>
  );
}
