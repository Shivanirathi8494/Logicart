import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      challanNumber: string;
    }>;
  }
) {

  const { challanNumber } = await params;

  const challan = await prisma.deliveryChallan.findUnique({

    where: {
      challanNumber,
    },

    include: {

      shipments: {

        include: {

          shipment: true,

        },

      },

    },

  });

  if (!challan) {

    return NextResponse.json(
      {
        error: "Delivery Challan not found",
      },
      {
        status: 404,
      }
    );

  }

  return NextResponse.json(challan);

}
