import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

import {
  getUserBranchCode,
  requireUser,
} from "@/lib/auth/authorization";

import {
  DeliveryChallanService,
} from "@/lib/services/delivery-challan.service";

export async function GET() {
  try {
    await requireUser();

    const challans =
      await prisma.deliveryChallan.findMany({
        include: {
          shipments: {
            include: {
              shipment: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      challans
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

    return NextResponse.json(
      {
        error:
          "Unable to fetch Delivery Challans.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const user =
      await requireUser();

    const body =
      await request.json();

    if (
      !Array.isArray(
        body.shipments
      ) ||
      body.shipments.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one shipment is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Never trust shipment details sent
     * by the browser.
     *
     * Reload the actual shipment records
     * from the database.
     */
    const shipments =
      await prisma.shipment.findMany({
        where: {
          id: {
            in: body.shipments,
          },
        },
      });

    if (
      shipments.length !==
      body.shipments.length
    ) {
      return NextResponse.json(
        {
          error:
            "One or more shipments could not be found.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Delivery Challan can only be
     * generated after OUTSCAN.
     */
    const invalidStatus =
      shipments.find(
        (shipment) =>
          shipment.status !==
          "OUTSCAN"
      );

    if (invalidStatus) {
      return NextResponse.json(
        {
          error:
            `Shipment ${invalidStatus.trackingNumber} is not in OUTSCAN status.`,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * All shipments in one Delivery
     * Challan should belong to the
     * same destination branch.
     */
    const destinations =
      new Set(
        shipments.map(
          (shipment) =>
            shipment.destination
              .trim()
              .toUpperCase()
        )
      );

    if (
      destinations.size !== 1
    ) {
      return NextResponse.json(
        {
          error:
            "All shipments in a Delivery Challan must have the same destination.",
        },
        {
          status: 400,
        }
      );
    }

    const destination =
      shipments[0].destination
        .trim()
        .toUpperCase();

    /*
     * Branch employee:
     * destination must equal their
     * assigned branch.
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

      if (
        destination !==
        branchCode
      ) {
        return NextResponse.json(
          {
            error:
              "You can generate Delivery Challans only for shipments arriving at your branch.",
          },
          {
            status: 403,
          }
        );
      }

      /*
       * Delivery Challan number should
       * belong to the branch performing
       * destination delivery work.
       */
      body.origin =
        branchCode;
    } else {
      /*
       * Admin/non-employee operation:
       * derive the challan branch from
       * the shipment destination.
       */
      body.origin =
        destination;
    }

    const challan =
      await DeliveryChallanService.create(
        body
      );

    return NextResponse.json(
      challan,
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(error);

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

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to create Delivery Challan.",
      },
      {
        status: 500,
      }
    );
  }
}
