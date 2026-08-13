import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const airlines = await prisma.airline.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      iataDesignator: true,
      icaoCode: true,
      iataPrefix: true,
      active: true,
    },
  });

  return NextResponse.json(airlines);
}
