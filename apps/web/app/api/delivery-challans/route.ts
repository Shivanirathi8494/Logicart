import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DeliveryChallanService } from "@/lib/services/delivery-challan.service";

export async function GET() {

  const challans = await prisma.deliveryChallan.findMany({

    include: {

      shipments: {

        include: {

          shipment: true,

        },

      },

    },

    orderBy: {

      createdAt: "desc",

    },

  });

  return NextResponse.json(challans);

}

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    const challan = await DeliveryChallanService.create(body);

    return NextResponse.json(challan, {
      status: 201,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );

  }

}
