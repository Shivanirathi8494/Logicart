import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { airportByCode } from "@/lib/master/airports";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const shipments = await prisma.shipment.findMany({
      where: {
        trackingNumber: {
          in: body.trackingNumbers,
        },
      },
    });

    if (shipments.length === 0) {
      return NextResponse.json(
        {
          error: "No shipments found.",
        },
        {
          status: 404,
        },
      );
    }

    const firstShipment = shipments[0];

    const manifestNumber =
      "MNF-" + firstShipment.origin + "-" + firstShipment.trackingNumber;

    const existingManifest = await prisma.manifest.findUnique({
      where: {
        manifestNumber,
      },
    });

    if (existingManifest) {
      return NextResponse.json(
        {
          error: "Manifest already exists.",
          manifestNumber,
          id: existingManifest.id,
        },
        {
          status: 409,
        },
      );
    }

    const manifest = await prisma.manifest.create({
      data: {
        manifestNumber,

        manifestDate: new Date(),

        origin: body.origin,

        destination: body.destination,

        loadingTallyId: body.loadingTallyId,

        remarks: "Generated from " + body.loadingTallyNumber,

        shipments: {
          create: shipments.map((s) => ({
            shipmentId: s.id,
          })),
        },
      },

      include: {
        shipments: true,
      },
    });

    await prisma.shipment.updateMany({
      where: {
        id: {
          in: shipments.map((s) => s.id),
        },
      },

      data: {
        status: "MANIFESTED",
      },
    });

    const locationCode = String(body.origin ?? "")
      .trim()
      .toUpperCase();

    const airport = airportByCode[locationCode];

    const eventAt = new Date();

    await prisma.shipmentTrackingEvent.createMany({
      data: shipments.map((shipment) => ({
        shipmentId: shipment.id,
        status: "MANIFESTED",
        eventType: "STATUS_CHANGE",
        locationCode,
        locationName: airport?.city ?? locationCode,
        remarks: `Shipment manifested for dispatch - ${manifest.manifestNumber}`,
        eventAt,
      })),
    });

    await prisma.loadingTallyShipment.updateMany({
      where: {
        loadingTallyId: body.loadingTallyId,

        shipmentId: {
          in: shipments.map((s) => s.id),
        },
      },

      data: {
        manifestId: manifest.id,
      },
    });

    // Close the Loading Tally only when every shipment
    // in that tally has been assigned to a Manifest.
    const remainingShipments = await prisma.loadingTallyShipment.count({
      where: {
        loadingTallyId: body.loadingTallyId,
        manifestId: null,
      },
    });

    if (remainingShipments === 0) {
      await prisma.loadingTally.update({
        where: {
          id: body.loadingTallyId,
        },
        data: {
          status: "COMPLETED",
        },
      });
    }

    return NextResponse.json(manifest);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      },
    );
  }
}
