import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { airportByCode } from "@/lib/master/airports";

import {
  getShipmentWorkingSide,
  getUserBranchCode,
  requireUser,
} from "@/lib/auth/authorization";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();

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

    const shipments = await prisma.shipment.findMany({
      where: {
        trackingNumber: {
          in: trackingNumbers,
        },
      },
    });

    if (shipments.length !== trackingNumbers.length) {
      return NextResponse.json(
        {
          error: "One or more shipments were not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Branch employees may perform
     * destination processing only on
     * shipments arriving at their branch.
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

      for (const shipment of shipments) {
        const side = getShipmentWorkingSide(branchCode, shipment);

        if (side !== "DESTINATION" && side !== "BOTH") {
          return NextResponse.json(
            {
              error: `${shipment.trackingNumber} is not a destination shipment for your branch.`,
            },
            {
              status: 403,
            },
          );
        }

        /*
         * Allowed destination transitions:
         *
         * MANIFESTED       -> RECEIVED
         * RECEIVED         -> OUTSCAN
         * OUT_FOR_DELIVERY -> DELIVERED
         */

        if (body.status === "RECEIVED" && shipment.status !== "MANIFESTED") {
          return NextResponse.json(
            {
              error: `${shipment.trackingNumber} must be MANIFESTED before it can be received.`,
            },
            { status: 409 },
          );
        }

        if (body.status === "OUTSCAN" && shipment.status !== "RECEIVED") {
          return NextResponse.json(
            {
              error: `${shipment.trackingNumber} must be RECEIVED before Outscan.`,
            },
            { status: 409 },
          );
        }

        if (
          body.status === "DELIVERED" &&
          shipment.status !== "OUT_FOR_DELIVERY"
        ) {
          return NextResponse.json(
            {
              error: `${shipment.trackingNumber} must be OUT_FOR_DELIVERY before it can be delivered.`,
            },
            { status: 409 },
          );
        }

        if (
          body.status !== "RECEIVED" &&
          body.status !== "OUTSCAN" &&
          body.status !== "DELIVERED"
        ) {
          return NextResponse.json(
            {
              error:
                "This status transition is not allowed for a branch employee.",
            },
            { status: 403 },
          );
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.shipment.updateMany({
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

      /*
       * Record public tracking events for status changes
       * performed through this bulk endpoint.
       *
       * RECEIVED is recorded by the destination unload
       * workflow, so do not duplicate it here.
       */
      if (body.status === "OUTSCAN" || body.status === "DELIVERED") {
        const eventAt = new Date();

        await tx.shipmentTrackingEvent.createMany({
          data: shipments.map((shipment) => {
            const locationCode = shipment.destination.trim().toUpperCase();

            const airport = airportByCode[locationCode];

            return {
              shipmentId: shipment.id,
              status: body.status,
              eventType: "STATUS_CHANGE" as const,
              locationCode,
              locationName: airport?.city ?? locationCode,
              createdByUserId: user.id ?? null,
              remarks:
                body.remarks?.trim() ||
                (body.status === "OUTSCAN"
                  ? "Shipment outscanned for delivery"
                  : "Shipment delivered successfully"),
              eventAt,
            };
          }),
        });
      }

      /*
       * Final delivery closes the corresponding
       * Delivery Challan as well.
       */
      if (body.status === "DELIVERED") {
        await tx.deliveryChallan.updateMany({
          where: {
            shipments: {
              some: {
                shipment: {
                  trackingNumber: {
                    in: trackingNumbers,
                  },
                },
              },
            },
          },

          data: {
            status: "DELIVERED",
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      updated: trackingNumbers.length,
    });
  } catch (error: any) {
    console.error(error);

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

    return NextResponse.json(
      {
        error: error?.message || "Unable to update shipments.",
      },
      {
        status: 500,
      },
    );
  }
}
