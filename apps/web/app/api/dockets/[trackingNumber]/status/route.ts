import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      }
    );

  }
}
