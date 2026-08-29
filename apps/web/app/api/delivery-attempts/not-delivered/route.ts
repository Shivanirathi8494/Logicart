import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { airportByCode } from "@/lib/master/airports";
import { recordShipmentTrackingEvent } from "@/lib/tracking/recordShipmentTrackingEvent";

import { getUserBranchCode, requireUser } from "@/lib/auth/authorization";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const trackingNumber = String(body.trackingNumber ?? "").trim();

    const remarks = String(body.remarks ?? "").trim();

    if (!trackingNumber) {
      return NextResponse.json(
        {
          error: "Tracking number is required.",
        },
        { status: 400 },
      );
    }

    if (!remarks) {
      return NextResponse.json(
        {
          error: "Not Delivered reason is required.",
        },
        { status: 400 },
      );
    }

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },

      select: {
        id: true,
        trackingNumber: true,
        origin: true,
        destination: true,
        status: true,
      },
    });

    if (!shipment) {
      return NextResponse.json(
        {
          error: "Shipment not found.",
        },
        { status: 404 },
      );
    }

    /*
     * Delivery result belongs to
     * destination branch.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode = getUserBranchCode(user);

      if (
        !branchCode ||
        shipment.destination.trim().toUpperCase() !== branchCode
      ) {
        return NextResponse.json(
          {
            error: "Shipment does not belong to your destination branch.",
          },
          { status: 403 },
        );
      }
    }

    /*
     * Not Delivered is only valid while
     * shipment is OUT_FOR_DELIVERY.
     */
    if (shipment.status !== "OUT_FOR_DELIVERY") {
      return NextResponse.json(
        {
          error: `AWB ${trackingNumber} is currently ${shipment.status}.`,
        },
        { status: 409 },
      );
    }

    const attempt = await prisma.$transaction(async (tx) => {
      /*
       * Prevent two operators from
       * updating the same AWB.
       */
      const updated = await tx.shipment.updateMany({
        where: {
          id: shipment.id,
          status: "OUT_FOR_DELIVERY",
        },

        data: {
          /*
           * Return shipment to
           * delivery-processing queue.
           */
          status: "OUTSCAN",
        },
      });

      if (updated.count !== 1) {
        throw new Error("SHIPMENT_ALREADY_UPDATED");
      }

      const deliveryAttempt = await tx.deliveryAttempt.create({
        data: {
          shipmentId: shipment.id,

          createdByUserId: user.id,

          outcome: "NOT_DELIVERED",

          remarks,
        },
      });

      const locationCode = shipment.destination.trim().toUpperCase();

      const airport = airportByCode[locationCode];

      await recordShipmentTrackingEvent({
        db: tx,
        shipmentId: shipment.id,

        /*
         * Shipment returns to OUTSCAN so it
         * can enter delivery processing again.
         */
        status: "OUTSCAN",

        eventType: "DELIVERY_ATTEMPT",

        locationCode,

        locationName: airport?.city ?? locationCode,

        createdByUserId: user.id ?? null,

        remarks: `Delivery attempted - ${remarks}`,

        eventAt: deliveryAttempt.attemptedAt,
      });

      return deliveryAttempt;
    });

    return NextResponse.json({
      success: true,
      trackingNumber,
      status: "OUTSCAN",
      attempt,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "SHIPMENT_ALREADY_UPDATED"
    ) {
      return NextResponse.json(
        {
          error:
            "Another operator already updated this shipment. Please refresh.",
        },
        { status: 409 },
      );
    }

    console.error("Not Delivered error:", error);

    return NextResponse.json(
      {
        error: "Unable to record Not Delivered attempt.",
      },
      { status: 500 },
    );
  }
}
