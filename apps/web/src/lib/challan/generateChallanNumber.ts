import { prisma } from "@/lib/prisma";

export async function generateChallanNumber(
  origin: string
) {
  const branch =
    origin.trim().toUpperCase();

  /*
   * Challan numbers use India business date.
   * Example:
   *
   * DC-BLR-260825-000001
   */
  const indiaNow = new Date(
    new Date().toLocaleString(
      "en-US",
      {
        timeZone: "Asia/Kolkata",
      }
    )
  );

  const yy =
    String(
      indiaNow.getFullYear()
    ).slice(-2);

  const mm =
    String(
      indiaNow.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      indiaNow.getDate()
    ).padStart(2, "0");

  const prefix =
    `DC-${branch}-${yy}${mm}${dd}-`;

  const latest =
    await prisma.deliveryChallan.findFirst({
      where: {
        challanNumber: {
          startsWith: prefix,
        },
      },

      orderBy: {
        challanNumber: "desc",
      },

      select: {
        challanNumber: true,
      },
    });

  let nextSequence = 1;

  if (latest) {
    const sequence =
      Number(
        latest.challanNumber
          .slice(prefix.length)
      );

    if (
      Number.isFinite(sequence)
    ) {
      nextSequence =
        sequence + 1;
    }
  }

  return (
    prefix +
    String(nextSequence)
      .padStart(6, "0")
  );
}
