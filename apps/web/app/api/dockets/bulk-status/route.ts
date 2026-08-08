import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {

  try {

    const body = await request.json();

    const trackingNumbers: string[] = body.trackingNumbers ?? [];

    if (!trackingNumbers.length) {

      return NextResponse.json(
        {
          error: "No shipments selected.",
        },
        {
          status: 400,
        },
      );

    }

    await prisma.shipment.updateMany({

      where: {

        trackingNumber: {

          in: trackingNumbers,

        },

      },

      data: {

        status: body.status,

        remarks: body.remarks ?? "",

      },

    });

    return NextResponse.json({

      success: true,

      updated: trackingNumbers.length,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update shipments.",
      },
      {
        status: 500,
      },
    );

  }

}
