import { prisma } from "@/lib/prisma";

export async function generateChallanNumber(origin: string) {

  const today = new Date();

  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const prefix = `DC-${origin}-${yy}${mm}${dd}`;

  const count = await prisma.deliveryChallan.count({
    where: {
      challanNumber: {
        startsWith: prefix,
      },
    },
  });

  return `${prefix}-${String(count + 1).padStart(6, "0")}`;

}
