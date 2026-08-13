import { prisma } from "@/lib/prisma";

function calculateCheckDigit(serial: number): number {
  return serial % 7;
}

export async function previewAwbNumber(airlineId: string) {
  const airline = await prisma.airline.findUnique({
    where: {
      id: airlineId,
    },
  });

  if (!airline) {
    throw new Error("Airline not found.");
  }

  if (!airline.active) {
    throw new Error("Airline is inactive.");
  }

  if (!airline.iataPrefix) {
    throw new Error(
      `No verified IATA AWB prefix is configured for ${airline.name}.`,
    );
  }

  const sequence = await prisma.awbSequence.findUnique({
    where: {
      airlineId,
    },
  });

  const serial = sequence?.nextSerial ?? 1;

  if (serial > 9999999) {
    throw new Error(
      `AWB serial range exhausted for ${airline.name}.`,
    );
  }

  const serialText = String(serial).padStart(7, "0");
  const checkDigit = calculateCheckDigit(serial);

  return `${airline.iataPrefix}-${serialText}${checkDigit}`;
}
