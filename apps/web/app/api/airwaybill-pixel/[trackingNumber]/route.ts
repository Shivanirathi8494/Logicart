import {
  NextRequest,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  generatePixelPerfectAirWaybill,
} from "@/lib/airwaybill/generatePixelPerfectAirWaybill";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      trackingNumber: string;
    }>;
  },
) {
  const {
    trackingNumber,
  } = await params;

  const shipment =
    await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },

      include: {
        packages: true,
        airline: true,
        customer: true,
        agent: true,
      },
    });

  if (!shipment) {
    return Response.json(
      {
        error:
          "Shipment not found",
      },
      {
        status: 404,
      },
    );
  }

  const pdf =
    await generatePixelPerfectAirWaybill(
      shipment,
    );

  return new Response(
    Buffer.from(pdf),
    {
      headers: {
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          `inline; filename="${trackingNumber}-pixel.pdf"`,

        "Cache-Control":
          "no-store",
      },
    },
  );
}
