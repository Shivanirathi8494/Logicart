import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCompleteAirWaybill } from "@/lib/airwaybill/generateCompleteAirWaybill";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ trackingNumber: string }>;
  },
) {
  const { trackingNumber } = await params;

  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber },
    include: {
      packages: true,
      airline: true,
      customer: true,
      agent: true,
    },
  });

  if (!shipment) {
    return new Response(
      JSON.stringify({ error: "Shipment not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const pdf = await generateCompleteAirWaybill(shipment);

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${trackingNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
