import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
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

    const invalidStatus =
      challan.shipments.find(
        (entry) =>
          entry.shipment.status !==
          "OUT_FOR_DELIVERY"
      );

    if (invalidStatus) {
      return NextResponse.json(
        {
          error:
            `${invalidStatus.shipment.trackingNumber} must be OUT_FOR_DELIVERY before it can be marked delivered.`,
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
                  "OUT_FOR_DELIVERY",
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
