import { prisma } from "@/lib/prisma";

import type {
  ExternalFlightSchedule,
} from "./types";

export async function saveFlightSchedules(
  schedules:
    ExternalFlightSchedule[],
) {
  let saved = 0;
  let skipped = 0;

  for (const schedule of schedules) {
    const airline =
      await prisma.airline.findUnique({
        where: {
          iataDesignator:
            schedule.airlineIata,
        },
      });

    if (!airline) {
      console.warn(
        "Unknown airline:",
        schedule.airlineIata,
        schedule.flightNumber,
      );

      skipped++;
      continue;
    }

    await prisma.flightSchedule.upsert({
      where: {
        flightNumber_origin_destination_scheduledDeparture: {
          flightNumber:
            schedule.flightNumber,

          origin:
            schedule.origin,

          destination:
            schedule.destination,

          scheduledDeparture:
            new Date(
              schedule.scheduledDeparture,
            ),
        },
      },

      update: {
        airlineId:
          airline.id,

        scheduledArrival:
          new Date(
            schedule.scheduledArrival,
          ),

        aircraftType:
          schedule.aircraftType ||
          null,

        departureTerminal:
          schedule.departureTerminal ||
          null,

        arrivalTerminal:
          schedule.arrivalTerminal ||
          null,

        externalId:
          schedule.externalId ||
          null,

        active: true,
      },

      create: {
        airlineId:
          airline.id,

        flightNumber:
          schedule.flightNumber,

        origin:
          schedule.origin,

        destination:
          schedule.destination,

        scheduledDeparture:
          new Date(
            schedule.scheduledDeparture,
          ),

        scheduledArrival:
          new Date(
            schedule.scheduledArrival,
          ),

        aircraftType:
          schedule.aircraftType ||
          null,

        departureTerminal:
          schedule.departureTerminal ||
          null,

        arrivalTerminal:
          schedule.arrivalTerminal ||
          null,

        externalId:
          schedule.externalId ||
          null,

        source:
          "AERODATABOX",

        active: true,
      },
    });

    saved++;
  }

  return {
    saved,
    skipped,
  };
}
