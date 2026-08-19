import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const { trackingNumber } = await params;

  const shipment = await prisma.shipment.findUnique({

    where: {
      trackingNumber,
    },

    include: {
      packages: true,
      airline: true,
      customer: true,
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

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      trackingNumber: string;
    }>;
  },
) {

  const { trackingNumber } = await params;

  const body = await request.json();

  const shipment = await prisma.shipment.findUnique({
    where: {
      trackingNumber,
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

  await prisma.shipmentPackage.deleteMany({
    where: {
      shipmentId: shipment.id,
    },
  });

  const updated = await prisma.shipment.update({

    where: {
      trackingNumber,
    },

    data: {

      bookingDate: new Date(body.bookingDate),

      customerId: body.customerId || null,

      origin: body.origin,
      destination: body.destination,

      airlineId: body.airlineId || null,
      flightNumber: body.flightNumber || null,

      scheduledDeparture:
        body.scheduledDeparture
          ? new Date(body.scheduledDeparture)
          : null,

      scheduledArrival:
        body.scheduledArrival
          ? new Date(body.scheduledArrival)
          : null,

      aircraftType:
        body.aircraftType || null,

      departureTerminal:
        body.departureTerminal || null,

      arrivalTerminal:
        body.arrivalTerminal || null,

      senderName: body.senderName,
      senderPhone: body.senderPhone,
      senderGSTIN: body.senderGSTIN,
      senderPincode: body.senderPincode,
      senderState: body.senderState,
      senderCity: body.senderCity,
      senderAddress: body.senderAddress,

      receiverName: body.receiverName,
      receiverPhone: body.receiverPhone,
      receiverGSTIN: body.receiverGSTIN,
      receiverPincode: body.receiverPincode,
      receiverState: body.receiverState,
      receiverCity: body.receiverCity,
      receiverAddress: body.receiverAddress,

      packageCount: body.packageCount,

      actualWeight: body.actualWeight,
      volumetricWeight: body.volumetricWeight,
      chargeableWeight: body.chargeableWeight,

      contents: body.contents,

      freight: body.freight,
      gst: body.gst,
      total: body.total,

      paymentReference: body.paymentReference,
      remarks: body.remarks,

      packages: {

        create: body.packages.map((pkg: any) => ({
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
        })),

      },

    },

    include: {
      packages: true,
    },

  });

  return NextResponse.json(updated);

}
