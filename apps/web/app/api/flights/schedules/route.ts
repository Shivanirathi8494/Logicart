import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

import {
  requireUser,
} from "@/lib/auth/authorization";

import {
  fetchRouteFlights,
} from "@/lib/flights/aerodatabox";

import {
  saveFlightSchedules,
} from "@/lib/flights/sync";

const CACHE_DAYS = 7;

function indiaDate(date: string) {
  return new Date(
    `${date}T00:00:00+05:30`,
  );
}

function range(date: string) {
  return {
    start: new Date(
      `${date}T00:00:00+05:30`,
    ),

    end: new Date(
      `${date}T23:59:59+05:30`,
    ),
  };
}

async function getFlights(
  origin: string,
  destination: string,
  date: string,
  airlineId?: string,
) {
  const {
    start,
    end,
  } = range(date);

  return prisma.flightSchedule.findMany({
    where: {
      origin,
      destination,
      active: true,

      ...(airlineId
        ? { airlineId }
        : {}),

      scheduledDeparture: {
        gte: start,
        lte: end,
      },
    },

    include: {
      airline: true,
    },

    orderBy: {
      scheduledDeparture: "asc",
    },
  });
}

function serialize(
  flights: Awaited<
    ReturnType<typeof getFlights>
  >,
) {
  return flights.map((flight) => ({
    id: flight.id,

    airlineId:
      flight.airlineId,

    airlineName:
      flight.airline.name,

    airlineCode:
      flight.airline
        .iataDesignator,

    flightNumber:
      flight.flightNumber,

    origin:
      flight.origin,

    destination:
      flight.destination,

    scheduledDeparture:
      flight.scheduledDeparture
        .toISOString(),

    scheduledArrival:
      flight.scheduledArrival
        .toISOString(),

    aircraftType:
      flight.aircraftType,

    departureTerminal:
      flight.departureTerminal,

    arrivalTerminal:
      flight.arrivalTerminal,

    source:
      flight.source,
  }));
}

export async function GET(
  request: NextRequest,
) {
  try {
    await requireUser();

    const origin =
      request.nextUrl.searchParams
        .get("origin")
        ?.toUpperCase() ?? "";

    const destination =
      request.nextUrl.searchParams
        .get("destination")
        ?.toUpperCase() ?? "";

    const date =
      request.nextUrl.searchParams
        .get("date") ?? "";

    const airlineId =
      request.nextUrl.searchParams
        .get("airlineId") ?? "";

    if (
      !origin ||
      !destination ||
      !date
    ) {
      return NextResponse.json(
        {
          error:
            "Origin, destination and date are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      origin === destination
    ) {
      return NextResponse.json(
        {
          error:
            "Origin and destination cannot be the same.",
        },
        {
          status: 400,
        },
      );
    }

    const flightDate =
      indiaDate(date);

    const flightScheduleSync =
      (prisma as any).flightScheduleSync;

    console.log(
      "flightScheduleSync available:",
      !!flightScheduleSync,
    );

    let syncRecord = null;

    if (flightScheduleSync) {
      syncRecord =
        await flightScheduleSync.findUnique({
          where: {
            origin_destination_flightDate: {
              origin,
              destination,
              flightDate,
            },
          },
        });
    }

    /*
     * Bootstrap cache metadata for schedules that were
     * synchronized before FlightScheduleSync was introduced.
     */
    let existingFlights =
      await getFlights(
        origin,
        destination,
        date,
      );

    if (
      !syncRecord &&
      existingFlights.length > 0
    ) {
      const newestUpdate =
        existingFlights.reduce(
          (latest, flight) =>
            flight.updatedAt > latest
              ? flight.updatedAt
              : latest,
          existingFlights[0].updatedAt,
        );

      if (flightScheduleSync) {
        syncRecord =
          await flightScheduleSync.create({
            data: {
              origin,
              destination,
              flightDate,
              provider:
                existingFlights[0].source ||
                "AERODATABOX",
              resultCount:
                existingFlights.length,
              lastSyncedAt:
                newestUpdate,
            },
          });
      }

      console.log(
        `Bootstrapped flight cache: ${origin} -> ${destination} ${date} (${existingFlights.length} flights)`,
      );
    }

    const cacheAge =
      syncRecord
        ? Date.now() -
          syncRecord.lastSyncedAt.getTime()
        : Number.POSITIVE_INFINITY;

    const maxAge =
      CACHE_DAYS *
      24 *
      60 *
      60 *
      1000;

    const fresh =
      cacheAge < maxAge;

    if (fresh) {
      if (
        existingFlights.length === 0
      ) {
        existingFlights =
          await getFlights(
            origin,
            destination,
            date,
          );
      }

      return NextResponse.json({
        configured: true,
        provider:
          "FLIGHT_MASTER_CACHE",
        cached: true,
        lastSyncedAt:
          syncRecord?.lastSyncedAt,
        schedules:
          serialize(
            existingFlights,
          ),
      });
    }

    console.log(
      `Refreshing flight cache: ${origin} -> ${destination} ${date}`,
    );

    const externalFlights =
      await fetchRouteFlights({
        origin,
        destination,
        date,
      });

    /*
     * Remove stale rows for this
     * route/date before writing
     * the refreshed schedule.
     */
    const {
      start,
      end,
    } = range(date);

    await prisma.flightSchedule.deleteMany({
      where: {
        origin,
        destination,

        scheduledDeparture: {
          gte: start,
          lte: end,
        },
      },
    });

    const saveResult =
      await saveFlightSchedules(
        externalFlights,
      );

    await prisma.flightScheduleSync.upsert({
      where: {
        origin_destination_flightDate: {
          origin,
          destination,
          flightDate,
        },
      },

      update: {
        provider:
          "AERODATABOX",

        resultCount:
          saveResult.saved,

        lastSyncedAt:
          new Date(),
      },

      create: {
        origin,
        destination,
        flightDate,

        provider:
          "AERODATABOX",

        resultCount:
          saveResult.saved,

        lastSyncedAt:
          new Date(),
      },
    });

    const flights =
      await getFlights(
        origin,
        destination,
        date,
        airlineId || undefined,
      );

    return NextResponse.json({
      configured: true,

      provider:
        "AERODATABOX",

      cached: false,

      schedules:
        serialize(flights),

      message:
        flights.length === 0
          ? `No scheduled flights were found for ${origin} → ${destination} on ${date}.`
          : undefined,
    });
  } catch (error: any) {
    console.error(
      "Flight schedule API error:",
      error,
    );

    if (
      error?.message ===
      "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to load flight schedules.",
      },
      {
        status: 500,
      },
    );
  }
}
