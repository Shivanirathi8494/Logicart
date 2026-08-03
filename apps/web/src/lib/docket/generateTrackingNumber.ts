import { prisma } from "@/lib/prisma";

export async function generateTrackingNumber(
  origin: string,
  destination: string
) {

  const today = new Date();

  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const prefix = `${origin}-${destination}-${yy}${mm}${dd}`;

  const count = await prisma.shipment.count({
    where: {
      trackingNumber: {
        startsWith: prefix,
      },
    },
  });

  const sequence = String(count + 1).padStart(6, "0");

  return `${prefix}-${sequence}`;

}
