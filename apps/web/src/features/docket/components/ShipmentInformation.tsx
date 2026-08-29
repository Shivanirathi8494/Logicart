"use client";

import { useEffect, useRef, useState } from "react";

import StationSelect from "@/components/master/StationSelect";
import AirlineSelect from "@/components/master/AirlineSelect";
import { CreateShipmentRequest } from "@/types/shipment";

import CustomerSelect, { Customer } from "./CustomerSelect";

type Props = {
  shipment: CreateShipmentRequest;
  setShipment: React.Dispatch<React.SetStateAction<CreateShipmentRequest>>;
  originLocked?: boolean;

  /*
   * CLIENT bookings load service types from the
   * client's active negotiated rate contract.
   */
  clientPricing?: boolean;

  /*
   * Internal booking users can select the commercial
   * client account separately from Customer ID.
   */
  internalClientSelection?: boolean;
};

type CommercialClient = {
  id: string;
  code: string;
  companyName: string;
  billingType: string;
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
  originLocked = false,
  clientPricing = false,
  internalClientSelection = false,
}: Props) {
  const [commercialClients, setCommercialClients] = useState<
    CommercialClient[]
  >([]);

  const [loadingCommercialClients, setLoadingCommercialClients] =
    useState(false);

  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);

  const [loadingFlights, setLoadingFlights] = useState(false);

  const [flightSearchCompleted, setFlightSearchCompleted] = useState(false);

  const [flightStatusMessage, setFlightStatusMessage] = useState("");

  const [clientServiceTypes, setClientServiceTypes] = useState<string[]>([]);

  const [loadingClientServiceTypes, setLoadingClientServiceTypes] =
    useState(false);

  const [clientServiceTypeError, setClientServiceTypeError] = useState("");

  useEffect(() => {
    if (!internalClientSelection) {
      setCommercialClients([]);
      return;
    }

    let active = true;

    async function loadCommercialClients() {
      try {
        setLoadingCommercialClients(true);

        const response = await fetch("/api/clients/active", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load clients.");
        }

        if (!active) {
          return;
        }

        setCommercialClients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load commercial clients:", error);

        if (active) {
          setCommercialClients([]);
        }
      } finally {
        if (active) {
          setLoadingCommercialClients(false);
        }
      }
    }

    loadCommercialClients();

    return () => {
      active = false;
    };
  }, [internalClientSelection]);

  useEffect(() => {
    if (!clientPricing) {
      setClientServiceTypes([]);
      setClientServiceTypeError("");
      return;
    }

    const origin = String(shipment.origin || "")
      .trim()
      .toUpperCase();

    const destination = String(shipment.destination || "")
      .trim()
      .toUpperCase();

    if (!origin || !destination) {
      setClientServiceTypes([]);
      setClientServiceTypeError("");

      if (shipment.serviceType) {
        setShipment((previous) => ({
          ...previous,
          serviceType: "",
        }));
      }

      return;
    }

    const controller = new AbortController();

    async function loadClientServiceTypes() {
      try {
        setLoadingClientServiceTypes(true);
        setClientServiceTypeError("");

        const params = new URLSearchParams({
          origin,
          destination,
        });

        const response = await fetch(
          `/api/client/service-types?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load service types.");
        }

        const serviceTypes = Array.isArray(data.serviceTypes)
          ? data.serviceTypes.map((value: unknown) =>
              String(value).trim().toUpperCase(),
            )
          : [];

        setClientServiceTypes(serviceTypes);

        if (serviceTypes.length === 0) {
          setClientServiceTypeError("");

          setShipment((previous) => ({
            ...previous,
            serviceType: "",
          }));

          return;
        }

        /*
         * Exactly one contracted service:
         * auto-select it.
         *
         * For TESTCLIENT01 / BLR → DEL this
         * automatically becomes STANDARD.
         */
        if (serviceTypes.length === 1) {
          const onlyServiceType = serviceTypes[0];

          setShipment((previous) => {
            if (previous.serviceType === onlyServiceType) {
              return previous;
            }

            return {
              ...previous,
              serviceType: onlyServiceType,
            };
          });

          return;
        }

        /*
         * Multiple contracted services:
         * keep the current value only if it is
         * still valid for this route.
         */
        setShipment((previous) => {
          const current = String(previous.serviceType || "")
            .trim()
            .toUpperCase();

          if (current && serviceTypes.includes(current)) {
            return previous;
          }

          return {
            ...previous,
            serviceType: "",
          };
        });
      } catch (error: any) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Unable to load client service types:", error);

        setClientServiceTypes([]);

        setClientServiceTypeError(
          error?.message || "Unable to load service types.",
        );
      } finally {
        setLoadingClientServiceTypes(false);
      }
    }

    loadClientServiceTypes();

    return () => {
      controller.abort();
    };
  }, [clientPricing, shipment.origin, shipment.destination, setShipment]);

  const flightRequestRef = useRef<AbortController | null>(null);

  const flightRequestIdRef = useRef(0);

  async function findFlights(
    origin: string,
    destination: string,
    bookingDate: string,
    airlineId: string,
  ) {
    const requestId = ++flightRequestIdRef.current;

    if (!origin || !destination || !bookingDate || !airlineId) {
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

      const controller = new AbortController();

      flightRequestRef.current = controller;

      const response = await fetch(
        `/api/flights/schedules?${params.toString()}`,
        {
          signal: controller.signal,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load flights.");
      }

      if (requestId !== flightRequestIdRef.current) {
        return;
      }

      /*
       * Some flight API branches historically returned
       * `schedules`, while newer branches return `flights`.
       * Accept both, then enforce the selected airline.
       */
      const rawFlights = data.flights ?? data.schedules ?? [];

      const available = rawFlights.filter(
        (schedule: FlightSchedule) => schedule.airlineId === airlineId,
      );

      setSchedules(available);
      setFlightSearchCompleted(true);

      setFlightStatusMessage(
        available.length > 0
          ? `${available.length} flight(s) available`
          : "No flights available for the selected airline, route and booking date.",
      );

      if (data.configured === false) {
        setFlightStatusMessage(
          data.message || "Live flight schedule service is not configured.",
        );
      }
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error(error);

      setSchedules([]);
      setFlightSearchCompleted(true);
      setFlightStatusMessage("Unable to load flight schedules.");
    } finally {
      if (requestId === flightRequestIdRef.current) {
        setLoadingFlights(false);
      }
    }
  }

  function selectCustomer(customer: Customer | null) {
    setShipment((previous) => ({
      ...previous,

      customerId: customer?.id ?? "",

      senderName: customer?.name ?? previous.senderName,

      senderPhone: customer?.phone ?? previous.senderPhone,

      senderGSTIN: customer?.gstNumber ?? previous.senderGSTIN,

      senderCity: customer?.city ?? previous.senderCity,

      senderState: customer?.state ?? previous.senderState,

      senderAddress: customer?.address ?? previous.senderAddress,
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
    setFlightStatusMessage("Checking available flights...");

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
    const selected = schedules.find((schedule) => schedule.id === scheduleId);

    if (!selected) {
      return;
    }

    setShipment((previous) => ({
      ...previous,

      airlineId: selected.airlineId,

      flightNumber: selected.flightNumber,

      scheduledDeparture: selected.scheduledDeparture,

      scheduledArrival: selected.scheduledArrival,

      aircraftType: selected.aircraftType ?? "",

      departureTerminal: selected.departureTerminal ?? "",

      arrivalTerminal: selected.arrivalTerminal ?? "",

      trackingNumber: "",
    }));
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#0b2340] sm:mb-6 sm:text-xl">
        Shipment Information
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Booking Date *
          </label>

          <input
            required
            type="date"
            className="min-h-11 w-full rounded-lg border p-3 text-base"
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
            className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
            value={shipment.trackingNumber ?? ""}
            placeholder="Generated after flight/airline selection"
          />
        </div>

        {internalClientSelection && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Client ID
            </label>

            <select
              value={shipment.clientId ?? ""}
              onChange={(event) => {
                const clientId = event.target.value;

                setShipment((previous) => ({
                  ...previous,
                  clientId,

                  /*
                   * Commercial pricing depends on the client.
                   * Clear any previous rate-derived values when
                   * the selected client changes.
                   */
                  serviceType: "",
                  freight: 0,
                  gst: 0,
                  total: 0,
                  tariffError: "",
                }));
              }}
              disabled={loadingCommercialClients}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">
                {loadingCommercialClients
                  ? "Loading clients..."
                  : "Select Client ID"}
              </option>

              {commercialClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.code} - {client.companyName}
                </option>
              ))}
            </select>

            <p className="mt-1 text-xs text-slate-500">
              Select the commercial client account for pricing and billing.
            </p>
          </div>
        )}

        <CustomerSelect
          value={shipment.customerId ?? ""}
          onChange={selectCustomer}
        />

        <StationSelect
          label="Origin"
          value={shipment.origin ?? ""}
          disabled={originLocked}
          onChange={(origin) =>
            setShipment((previous) => ({
              ...previous,
              origin,
              serviceType: clientPricing ? "" : previous.serviceType,
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
              serviceType: clientPricing ? "" : previous.serviceType,
              flightNumber: "",
              scheduledDeparture: "",
              scheduledArrival: "",
            }))
          }
        />

        {clientPricing && (
          <div>
            {loadingClientServiceTypes ? (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pricing
                </label>

                <div className="min-h-11 w-full rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">
                  Checking contracted pricing...
                </div>
              </>
            ) : clientServiceTypes.length > 0 ? (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Service Type
                </label>

                <select
                  value={shipment.serviceType ?? ""}
                  onChange={(event) =>
                    setShipment((previous) => ({
                      ...previous,
                      serviceType: event.target.value,
                    }))
                  }
                  className="min-h-11 w-full rounded-lg border bg-white p-3 text-base"
                >
                  {clientServiceTypes.length > 1 && (
                    <option value="">Select service type</option>
                  )}

                  {clientServiceTypes.map((serviceType) => (
                    <option key={serviceType} value={serviceType}>
                      {serviceType}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-emerald-700">
                  Contracted client pricing is available for this route.
                </p>
              </>
            ) : shipment.origin && shipment.destination ? (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pricing
                </label>

                <div className="min-h-11 w-full rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="text-sm font-semibold text-blue-900">
                    Standard Airline Rate
                  </div>

                  <div className="mt-1 text-xs text-blue-700">
                    No negotiated client rate exists for this route. Select an
                    airline to calculate the backend standard rate.
                  </div>
                </div>
              </>
            ) : (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pricing
                </label>

                <div className="min-h-11 w-full rounded-lg border bg-slate-50 p-3 text-sm text-slate-500">
                  Select origin and destination.
                </div>
              </>
            )}
          </div>
        )}

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
                const response = await fetch(
                  "/api/dockets/next-awb?airlineId=" +
                    encodeURIComponent(airlineId),
                );

                if (!response.ok) {
                  throw new Error("Unable to preview AWB");
                }

                const data = await response.json();

                setShipment((previous) => ({
                  ...previous,
                  airlineId,
                  trackingNumber: data.trackingNumber ?? "",
                }));
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </div>

        <ReadOnlyField label="Transport Mode" value="AIR" />

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

        {!loadingFlights && flightSearchCompleted && schedules.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Available Flight
            </label>

            <select
              disabled={loadingFlights}
              value={
                schedules.find(
                  (schedule) => schedule.flightNumber === shipment.flightNumber,
                )?.id ?? ""
              }
              onChange={(event) => selectFlight(event.target.value)}
              className="min-h-11 w-full rounded-lg border p-3 text-base"
            >
              <option value="">
                {loadingFlights
                  ? "Loading available flights..."
                  : "Select Flight"}
              </option>

              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.flightNumber} |{" "}
                  {displayDateTime(schedule.scheduledDeparture)}
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
              value={displayDateTime(shipment.scheduledDeparture)}
            />

            <ReadOnlyField
              label="Scheduled Arrival"
              value={displayDateTime(shipment.scheduledArrival)}
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

        {shipment.aircraftType && shipment.aircraftType !== "TBD" && (
          <ReadOnlyField label="Aircraft" value={shipment.aircraftType} />
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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        readOnly
        value={value ?? ""}
        className="min-h-11 w-full rounded-lg border bg-slate-100 p-3 text-base"
      />
    </div>
  );
}
