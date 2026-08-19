import type {
  ExternalFlightSchedule,
} from "./types";

type AirportFlight = {
  number?: string;

  airline?: {
    name?: string;
    iata?: string;
    icao?: string;
  };

  departure?: {
    airport?: {
      iata?: string;
    };

    scheduledTime?: {
      local?: string;
      utc?: string;
    };

    terminal?: string;
  };

  arrival?: {
    airport?: {
      iata?: string;
    };

    scheduledTime?: {
      local?: string;
      utc?: string;
    };

    terminal?: string;
  };

  aircraft?: {
    model?: string;
  };

  callSign?: string;
};

type AeroDataBoxResponse = {
  departures?: AirportFlight[];
  arrivals?: AirportFlight[];
};

function getScheduledTime(
  movement:
    | AirportFlight["departure"]
    | AirportFlight["arrival"],
) {
  return (
    movement?.scheduledTime?.utc ||
    movement?.scheduledTime?.local ||
    ""
  );
}

async function fetchWindow({
  origin,
  fromLocal,
  toLocal,
}: {
  origin: string;
  fromLocal: string;
  toLocal: string;
}): Promise<AirportFlight[]> {
  const apiKey =
    process.env.AERODATABOX_API_KEY;

  const host =
    process.env.AERODATABOX_API_HOST ||
    "aerodatabox.p.rapidapi.com";

  if (!apiKey) {
    throw new Error(
      "AERODATABOX_API_KEY is not configured.",
    );
  }

  const url =
    `https://${host}` +
    `/flights/airports/iata/` +
    `${encodeURIComponent(origin)}/` +
    `${encodeURIComponent(fromLocal)}/` +
    `${encodeURIComponent(toLocal)}` +
    `?withLeg=true` +
    `&direction=Departure` +
    `&withCancelled=false` +
    `&withCodeshared=true` +
    `&withCargo=true` +
    `&withLocation=false`;

  console.log(
    `AeroDataBox: ${origin} ${fromLocal} -> ${toLocal}`,
  );

  const response =
    await fetch(url, {
      headers: {
        "X-RapidAPI-Key":
          apiKey,

        "X-RapidAPI-Host":
          host,
      },

      cache: "no-store",
    });

  if (!response.ok) {
    const body =
      await response.text();

    throw new Error(
      `AeroDataBox request failed (${response.status}): ${body}`,
    );
  }

  const data =
    (await response.json()) as
      AeroDataBoxResponse;

  return Array.isArray(
    data.departures,
  )
    ? data.departures
    : [];
}

export async function fetchRouteFlights({
  origin,
  destination,
  date,
}: {
  origin: string;
  destination: string;
  date: string;
}): Promise<ExternalFlightSchedule[]> {
  /*
   * AeroDataBox limits this endpoint
   * to a maximum 12-hour time range.
   *
   * Fetch the day in two windows:
   *
   * 00:00 -> 11:59
   * 12:00 -> 23:59
   */

  const morning =
    await fetchWindow({
      origin,
      fromLocal:
        `${date}T00:00`,
      toLocal:
        `${date}T11:59`,
    });

  // BASIC plan allows only 1 request per second.
  await new Promise((resolve) =>
    setTimeout(resolve, 1200),
  );

  const evening =
    await fetchWindow({
      origin,
      fromLocal:
        `${date}T12:00`,
      toLocal:
        `${date}T23:59`,
    });

  const departures = [
    ...morning,
    ...evening,
  ];

  const destinationCode =
    destination.toUpperCase();

  const mapped =
    departures
      .filter((flight) => {
        return (
          flight.arrival
            ?.airport
            ?.iata
            ?.toUpperCase() ===
          destinationCode
        );
      })
      .map((flight) => {
        const scheduledDeparture =
          getScheduledTime(
            flight.departure,
          );

        const scheduledArrival =
          getScheduledTime(
            flight.arrival,
          );

        return {
          externalId:
            flight.callSign ||
            flight.number,

          airlineIata:
            flight.airline
              ?.iata ||
            "",

          airlineName:
            flight.airline
              ?.name,

          flightNumber:
            flight.number ||
            "",

          origin:
            flight.departure
              ?.airport
              ?.iata ||
            origin,

          destination:
            flight.arrival
              ?.airport
              ?.iata ||
            destination,

          scheduledDeparture,

          scheduledArrival,

          aircraftType:
            flight.aircraft
              ?.model,

          departureTerminal:
            flight.departure
              ?.terminal,

          arrivalTerminal:
            flight.arrival
              ?.terminal,
        };
      })
      .filter(
        (flight) =>
          flight.airlineIata &&
          flight.flightNumber &&
          flight.scheduledDeparture &&
          flight.scheduledArrival,
      );

  /*
   * Codeshare data can occasionally
   * cause duplicates. De-duplicate by
   * flight + departure time.
   */

  const unique =
    new Map<
      string,
      ExternalFlightSchedule
    >();

  for (const flight of mapped) {
    const key =
      `${flight.flightNumber}-` +
      `${flight.origin}-` +
      `${flight.destination}-` +
      `${flight.scheduledDeparture}`;

    unique.set(
      key,
      flight,
    );
  }

  return [
    ...unique.values(),
  ];
}
