import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {

  try {

    const { trackingNumber } = await params;

    const shipment = await prisma.shipment.findUnique({

      where: {

        trackingNumber,

      },

      select: {

        trackingNumber: true,
        bookingDate: true,
        origin: true,
        destination: true,
        senderName: true,
        receiverName: true,
        status: true,
        remarks: true,
        freight: true,
        total: true,

      },

    });

    if (!shipment) {

      return NextResponse.json(
        {
          error: "Shipment not found.",
        },
        {
          status: 404,
        },
      );

    }

    return NextResponse.json(shipment);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to fetch shipment.",
      },
      {
        status: 500,
      },
    );

  }

}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {

  try {

    const { trackingNumber } = await params;

    const body = await request.json();

    const shipment = await prisma.shipment.update({

      where: {

        trackingNumber,

      },

      data: {

        status: body.status,

        remarks: body.remarks ?? "",

      },

    });

    return NextResponse.json(shipment);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update shipment",
      },
      {
        status: 500,
      },
    );

  }

}
