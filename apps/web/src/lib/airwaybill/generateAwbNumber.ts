import { prisma } from "@/lib/prisma";

function calculateCheckDigit(serial: number): number {
  return serial % 7;
}

export async function generateAwbNumber(airlineId: string) {
  return prisma.$transaction(async (tx) => {
    const airline = await tx.airline.findUnique({
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

    if (!airline.iataDesignator && !airline.iataPrefix) {
      throw new Error(
        `No IATA airline code or AWB prefix is configured for ${airline.name}.`,
      );
    }

    const sequence = await tx.awbSequence.upsert({
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

    const serial = sequence.nextSerial - 1;

    if (serial > 9999999) {
      throw new Error(
        `AWB serial range exhausted for ${airline.name}.`,
      );
    }

    const serialText = String(serial).padStart(7, "0");
    const checkDigit = calculateCheckDigit(serial);

    const airlineCode =
  airline.iataDesignator ||
  airline.iataPrefix ||
  "NA";

return `${airlineCode}-${serialText}${checkDigit}`;
  });
}
