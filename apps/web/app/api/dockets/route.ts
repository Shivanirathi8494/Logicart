import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ShipmentService } from "@/lib/services/shipment.service";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);

  const tracking = searchParams.get("tracking");
  const mobile = searchParams.get("mobile");
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const status = searchParams.get("status");

  const shipments = await prisma.shipment.findMany({

    where: {

      ...(tracking
        ? {
            trackingNumber: {
              contains: tracking,
              mode: "insensitive",
            },
          }
        : {}),

      ...(mobile
        ? {
            OR: [
              {
                senderPhone: {
                  contains: mobile,
                },
              },
              {
                receiverPhone: {
                  contains: mobile,
                },
              },
            ],
          }
        : {}),

      ...(origin ? { origin } : {}),

      ...(destination ? { destination } : {}),

      ...(status ? { status: status as any } : {}),

    },

    include: {
      packages: true,
    },

    orderBy: {
      createdAt: "desc",
    },

  });

  return NextResponse.json(shipments);

}

export async function POST(request: Request) {

  const body = await request.json();

  const shipment = await ShipmentService.create(body);

  return NextResponse.json(shipment,{status:201});

}
