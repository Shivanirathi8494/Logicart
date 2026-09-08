import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { airportByCode } from "@/lib/master/airports";
import { recordShipmentTrackingEvent } from "@/lib/tracking/recordShipmentTrackingEvent";

import { getUserBranchCode, requireUser } from "@/lib/auth/authorization";

export async function POST(
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
    const user = await requireUser();

    const { trackingNumber } = await params;

    const body = await request.json();

    const vehicleNumber = String(body.vehicleNumber ?? "")
      .trim()
      .toUpperCase();

    const remarks = String(body.remarks ?? "").trim();

    if (!vehicleNumber) {
      return NextResponse.json(
        {
          error: "Vehicle Number is required.",
        },
        {
          status: 400,
        },
      );
    }

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
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

    if (shipment.status !== "OUTSCAN") {
      return NextResponse.json(
        {
          error: `${shipment.trackingNumber} must be in OUTSCAN status before Out for Delivery.`,
        },
        {
          status: 409,
        },
      );
    }

    /*
     * Only Door-to-Door shipments enter
     * the last-mile Out for Delivery flow.
     *
     * Airport/Warehouse shipments remain
     * at the destination branch for handover.
     */
    if (shipment.deliveryType !== "DOOR_TO_DOOR") {
      return NextResponse.json(
        {
          error:
            "Airport / Warehouse Delivery shipments cannot be marked Out for Delivery.",
        },
        {
          status: 409,
        },
      );
    }

    /*
     * Delivery employee may dispatch only
     * shipments belonging to their branch.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode = getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error: "Your account is not assigned to a branch.",
          },
          {
            status: 403,
          },
        );
      }

      if (shipment.destination.trim().toUpperCase() !== branchCode) {
        return NextResponse.json(
          {
            error:
              "You can mark Out for Delivery only for shipments belonging to your delivery branch.",
          },
          {
            status: 403,
          },
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.updateMany({
        where: {
          id: shipment.id,
          status: "OUTSCAN",
        },

        data: {
          status: "OUT_FOR_DELIVERY",
        },
      });

      if (updated.count !== 1) {
        throw new Error(
          "Shipment is no longer available for Out for Delivery.",
        );
      }

      const record = await tx.outForDeliveryRecord.create({
        data: {
          shipmentId: shipment.id,

          vehicleNumber,

          /*
           * Snapshot receiver details
           * from original docket.
           */
          receiverName: shipment.receiverName,

          receiverPhone: shipment.receiverPhone,

          receiverAddress: shipment.receiverAddress,

          remarks: remarks || null,

          createdByUserId: user.id ?? null,
        },
      });

      const locationCode = shipment.destination.trim().toUpperCase();

      const airport = airportByCode[locationCode];

      await recordShipmentTrackingEvent({
        db: tx,
        shipmentId: shipment.id,
        status: "OUT_FOR_DELIVERY",
        locationCode,
        locationName: airport?.city ?? locationCode,
        createdByUserId: user.id ?? null,
        remarks: "Shipment out for delivery",
        eventAt: record.dispatchedAt,
      });

      return {
        shipment: {
          ...shipment,
          status: "OUT_FOR_DELIVERY",
        },

        record,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    console.error("Out for Delivery error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unable to mark shipment Out for Delivery.",
      },
      {
        status: 500,
      },
    );
  }
}
