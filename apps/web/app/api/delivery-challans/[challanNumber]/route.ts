import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { airportByCode } from "@/lib/master/airports";
import { recordShipmentTrackingEvent } from "@/lib/tracking/recordShipmentTrackingEvent";
import {
  getUserBranchCode,
  requireUser,
} from "@/lib/auth/authorization";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      challanNumber: string;
    }>;
  }
) {
  try {
    await requireUser();

    const { challanNumber } =
      await params;

    const challan =
      await prisma.deliveryChallan.findUnique({
        where: {
          challanNumber,
        },

        include: {
          shipments: {
            include: {
              shipment: true,
            },
          },
        },
      });

    if (!challan) {
      return NextResponse.json(
        {
          error:
            "Delivery Challan not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      challan
    );
  } catch (error: any) {
    if (
      error?.message ===
      "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to load Delivery Challan.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      challanNumber: string;
    }>;
  }
) {
  try {
    const user =
      await requireUser();

    const { challanNumber } =
      await params;

    const challan =
      await prisma.deliveryChallan.findUnique({
        where: {
          challanNumber,
        },

        include: {
          shipments: {
            include: {
              shipment: true,
            },
          },
        },
      });

    if (!challan) {
      return NextResponse.json(
        {
          error:
            "Delivery Challan not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      challan.status ===
      "DELIVERED"
    ) {
      return NextResponse.json(
        {
          error:
            "This Delivery Challan is already marked as delivered.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      challan.status !==
      "OPEN"
    ) {
      return NextResponse.json(
        {
          error:
            "Only OPEN Delivery Challans can be marked as delivered.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Employee can confirm delivery only
     * for shipments delivered by their
     * destination branch.
     */
    if (
      user.role === "EMPLOYEE"
    ) {
      const branchCode =
        getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error:
              "Your account is not assigned to a branch.",
          },
          {
            status: 403,
          }
        );
      }

      const invalidShipment =
        challan.shipments.find(
          (entry) =>
            entry.shipment.destination
              .trim()
              .toUpperCase() !==
            branchCode
        );

      if (invalidShipment) {
        return NextResponse.json(
          {
            error:
              "You can mark delivered only for shipments belonging to your delivery branch.",
          },
          {
            status: 403,
          }
        );
      }
    }

    const shipmentIds =
      challan.shipments.map(
        (entry) =>
          entry.shipmentId
      );

    /*
     * Delivery completion depends on delivery mode:
     *
     * DOOR_TO_DOOR:
     *   OUT_FOR_DELIVERY -> DELIVERED
     *
     * AIRPORT_DELIVERY:
     *   OUTSCAN -> DELIVERED
     */
    const requiredShipmentStatus =
      challan.deliveryType === "AIRPORT_DELIVERY"
        ? "OUTSCAN"
        : "OUT_FOR_DELIVERY";

    const invalidStatus =
      challan.shipments.find(
        (entry) =>
          entry.shipment.status !==
          requiredShipmentStatus
      );

    if (invalidStatus) {
      return NextResponse.json(
        {
          error:
            challan.deliveryType === "AIRPORT_DELIVERY"
              ? `${invalidStatus.shipment.trackingNumber} must be OUTSCAN before airport / warehouse handover can be completed.`
              : `${invalidStatus.shipment.trackingNumber} must be OUT_FOR_DELIVERY before it can be marked delivered.`,
        },
        {
          status: 409,
        }
      );
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
          const updatedShipments =
            await tx.shipment.updateMany({
              where: {
                id: {
                  in: shipmentIds,
                },

                status:
                  requiredShipmentStatus,
              },

              data: {
                status:
                  "DELIVERED",
              },
            });

          if (
            updatedShipments.count !==
            shipmentIds.length
          ) {
            throw new Error(
              "One or more shipments were already updated by another operator."
            );
          }

          /*
           * Record DELIVERED tracking event
           * for every shipment completed through
           * this Delivery Challan.
           */
          const deliveredAt = new Date();

          for (const entry of challan.shipments) {
            const shipment = entry.shipment;

            const locationCode =
              shipment.destination
                .trim()
                .toUpperCase();

            const airport =
              airportByCode[locationCode];

            await recordShipmentTrackingEvent({
              db: tx,
              shipmentId: shipment.id,
              status: "DELIVERED",
              locationCode,
              locationName:
                airport?.city ?? locationCode,
              createdByUserId:
                user.id ?? null,
              remarks:
                challan.deliveryType === "AIRPORT_DELIVERY"
                  ? "Shipment handed over at airport / warehouse"
                  : "Shipment delivered successfully",
              eventAt: deliveredAt,
            });
          }

          const updatedChallan =
            await tx.deliveryChallan.update({
              where: {
                id: challan.id,
              },

              data: {
                status:
                  "DELIVERED",
              },

              include: {
                shipments: {
                  include: {
                    shipment: true,
                  },
                },
              },
            });

          return updatedChallan;
        }
      );

    return NextResponse.json(
      result
    );
  } catch (error: any) {
    if (
      error?.message ===
      "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to mark Delivery Challan as delivered.",
      },
      {
        status: 500,
      }
    );
  }
}
