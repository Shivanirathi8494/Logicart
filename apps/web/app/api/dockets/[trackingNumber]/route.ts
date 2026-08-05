import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      trackingNumber: string;
    }>;
  },
) {

  const { trackingNumber } = await params;

  const shipment = await prisma.shipment.findUnique({

    where: {
      trackingNumber,
    },

    include: {
      packages: true,
    },

  });

  if (!shipment) {

    return NextResponse.json(
      {
        error: "Shipment not found",
      },
      {
        status: 404,
      },
    );

  }

  return NextResponse.json(shipment);

}
