import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUserBranchCode, requireUser } from "@/lib/auth/authorization";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();

    const trackingNumber = String(body.trackingNumber ?? "").trim();

    const receiverName = String(body.receiverName ?? "").trim();

    const receiverPhone = String(body.receiverPhone ?? "").trim();

    const receiverAddress = String(body.receiverAddress ?? "").trim();

    const remarks = String(body.remarks ?? "").trim();

    if (!trackingNumber) {
      return NextResponse.json(
        {
          error: "Tracking number is required.",
        },
        { status: 400 },
      );
    }

    if (!receiverName) {
      return NextResponse.json(
        {
          error: "Receiver Name is required.",
        },
        { status: 400 },
      );
    }

    if (!receiverPhone) {
      return NextResponse.json(
        {
          error: "Receiver Phone is required.",
        },
        { status: 400 },
      );
    }

    if (!receiverAddress) {
      return NextResponse.json(
        {
          error: "Receiver Address is required.",
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
     * Final delivery belongs to
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

    if (shipment.status !== "OUT_FOR_DELIVERY") {
      return NextResponse.json(
        {
          error: `AWB ${trackingNumber} is currently ${shipment.status}.`,
        },
        { status: 409 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Atomic status transition.
       */
      const updated = await tx.shipment.updateMany({
        where: {
          id: shipment.id,
          status: "OUT_FOR_DELIVERY",
        },

        data: {
          status: "DELIVERED",

          remarks: remarks || "Shipment delivered successfully",
        },
      });

      if (updated.count !== 1) {
        throw new Error("SHIPMENT_ALREADY_UPDATED");
      }

      /*
       * Persist who actually received
       * this shipment.
       */
      const attempt = await tx.deliveryAttempt.create({
        data: {
          shipmentId: shipment.id,

          createdByUserId: user.id,

          outcome: "DELIVERED",

          remarks: remarks || "Shipment delivered successfully",

          receiverName,

          receiverPhone,

          receiverAddress,
        },
      });

      /*
       * Final delivery completes
       * the Airport Delivery Challan.
       */
      await tx.deliveryChallan.updateMany({
        where: {
          shipments: {
            some: {
              shipmentId: shipment.id,
            },
          },

          status: "OPEN",
        },

        data: {
          status: "DELIVERED",
        },
      });

      return attempt;
    });

    return NextResponse.json({
      success: true,

      trackingNumber,

      status: "DELIVERED",

      deliveryAttempt: result,
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

    console.error("Delivered error:", error);

    return NextResponse.json(
      {
        error: "Unable to record final delivery.",
      },
      { status: 500 },
    );
  }
}
