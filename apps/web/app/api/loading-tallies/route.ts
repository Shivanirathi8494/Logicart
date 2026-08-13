import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const tallies = await prisma.loadingTally.findMany({

    include:{
      shipments:{
        include:{
          shipment:true,
        },
      },
    },

    orderBy:{
      createdAt:"desc",
    },

  });

  return NextResponse.json(tallies);

}

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    const shipmentIds = Array.isArray(body.shipmentIds)
      ? body.shipmentIds
      : [];

    if (!shipmentIds.length) {
      return NextResponse.json(
        {
          error: "No shipments selected.",
        },
        {
          status: 400,
        }
      );
    }

    // Fetch selected shipments.
    const shipments = await prisma.shipment.findMany({
      where: {
        id: {
          in: shipmentIds,
        },
      },
      select: {
        id: true,
        trackingNumber: true,
        origin: true,
        status: true,
      },
    });

    if (shipments.length !== shipmentIds.length) {
      return NextResponse.json(
        {
          error: "One or more selected AWBs were not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Only BOOKED shipments can be added to a Loading Tally.
    const unavailable = shipments.filter(
      (shipment) => shipment.status !== "BOOKED"
    );

    if (unavailable.length) {
      return NextResponse.json(
        {
          error:
            "Only BOOKED AWBs can be added to a Loading Tally.",
          awbs: unavailable.map(
            (shipment) => shipment.trackingNumber
          ),
        },
        {
          status: 400,
        }
      );
    }

    // Loading Tally number:
    // LT-{ORIGIN}-{FIRST-AWB}
    //
    // Example:
    // LT-BLR-296-00000114
    const firstShipment = shipments[0];

    const loadingTallyNumber =
      "LT-" +
      firstShipment.origin +
      "-" +
      firstShipment.trackingNumber;

    // Prevent duplicate Loading Tallies.
    const existingTally =
      await prisma.loadingTally.findUnique({
        where: {
          loadingTallyNumber,
        },
      });

    if (existingTally) {
      return NextResponse.json(
        {
          error: "Loading Tally already exists.",
          loadingTallyNumber,
          id: existingTally.id,
        },
        {
          status: 409,
        }
      );
    }

    const tally = await prisma.loadingTally.create({

      data: {

        loadingTallyNumber,

        loadingDate: new Date(
          body.loadingDate || new Date()
        ),

        remarks: body.remarks ?? "",

        shipments: {
          create: shipmentIds.map((id: string) => ({
            shipmentId: id,
          })),
        },

      },

      include: {
        shipments: {
          include: {
            shipment: true,
          },
        },
      },

    });

    return NextResponse.json(tally, {
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
