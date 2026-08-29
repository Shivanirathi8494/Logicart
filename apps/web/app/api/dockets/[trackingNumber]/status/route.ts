import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { airportByCode } from "@/lib/master/airports";

function statusTitle(status: string, eventType?: string) {
  if (eventType === "DELIVERY_ATTEMPT") {
    return "Delivery Attempted";
  }

  switch (status) {
    case "BOOKED":
      return "Shipment Booked";

    case "INSCAN":
      return "Shipment Inscanned";

    case "MANIFESTED":
      return "Shipment Manifested";

    case "RECEIVED":
      return "Shipment Received at Destination";

    case "OUTSCAN":
      return "Shipment Outscanned";

    case "OUT_FOR_DELIVERY":
      return "Out for Delivery";

    case "DELIVERED":
      return "Delivered";

    case "CANCELLED":
      return "Shipment Cancelled";

    default:
      return status.replaceAll("_", " ");
  }
}

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
        status: true,

        trackingEvents: {
          orderBy: {
            eventAt: "asc",
          },

          select: {
            id: true,
            status: true,
            eventType: true,
            locationCode: true,
            locationName: true,
            eventAt: true,
            remarks: true,

            /*
             * IMPORTANT:
             * createdByUserId / operator information
             * is intentionally NOT exposed publicly.
             */
          },
        },
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

    const events = shipment.trackingEvents.map((event) => ({
      id: event.id,

      status: event.status,

      eventType: event.eventType,

      title: statusTitle(event.status, event.eventType),

      location: {
        code: event.locationCode,

        name:
          event.locationName ||
          airportByCode[event.locationCode]?.city ||
          event.locationCode,
      },

      eventAt: event.eventAt,

      remarks: event.remarks,
    }));

    /*
     * For legacy shipments created before tracking
     * events existed, gracefully fall back to shipment
     * origin/current status instead of returning a
     * broken tracking page.
     */
    const latestEvent = events.length > 0 ? events[events.length - 1] : null;

    const fallbackLocationCode =
      shipment.status === "BOOKED" ||
      shipment.status === "INSCAN" ||
      shipment.status === "MANIFESTED"
        ? shipment.origin
        : shipment.destination;

    const fallbackLocation = airportByCode[fallbackLocationCode];

    return NextResponse.json({
      trackingNumber: shipment.trackingNumber,

      origin: {
        code: shipment.origin,

        name: airportByCode[shipment.origin]?.city || shipment.origin,
      },

      destination: {
        code: shipment.destination,

        name: airportByCode[shipment.destination]?.city || shipment.destination,
      },

      currentStatus: shipment.status,

      currentStatusTitle: statusTitle(shipment.status),

      currentLocation: latestEvent?.location ?? {
        code: fallbackLocationCode,

        name: fallbackLocation?.city || fallbackLocationCode,
      },

      lastUpdatedAt: latestEvent?.eventAt ?? shipment.bookingDate,

      events,
    });
  } catch (error) {
    console.error("Public tracking error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch shipment tracking.",
      },
      {
        status: 500,
      },
    );
  }
}
