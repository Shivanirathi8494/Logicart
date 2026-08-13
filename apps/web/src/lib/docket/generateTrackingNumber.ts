import { prisma } from "@/lib/prisma";

export async function generateTrackingNumber(
  airlineId: string,
) {
  const airline = await prisma.airline.findUnique({
    where: {
      id: airlineId,
    },
  });

  if (!airline) {
    throw new Error("Airline not found.");
  }

  if (!airline.iataPrefix) {
    throw new Error(
      `${airline.name} does not have an IATA AWB prefix configured.`,
    );
  }

  const sequence = await prisma.awbSequence.upsert({
    where: {
      airlineId,
    },

    create: {
      airlineId,
      nextSerial: 2,
    },

    update: {
      nextSerial: {
        increment: 1,
      },
    },
  });

  const serialNumber = sequence.nextSerial - 1;

  const serial = String(serialNumber).padStart(7, "0");

  const checkDigit = serialNumber % 7;

  return `${airline.iataPrefix}-${serial}-${checkDigit}`;
}
