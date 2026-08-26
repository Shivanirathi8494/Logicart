import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ShipmentService } from "@/lib/services/shipment.service";
import {
  getShipmentWorkflow,
} from "@/lib/workflow/shipmentWorkflow";
import {
  getUserBranchCode,
  requireRole,
  requireUser,
} from "@/lib/auth/authorization";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();

    const { searchParams } = new URL(request.url);

    const tracking = searchParams.get("tracking");
    const mobile = searchParams.get("mobile");
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const status = searchParams.get("status");

    const ownerScope =
      user.role === "CLIENT"
        ? { clientId: user.clientId ?? "__NO_CLIENT__" }
        : user.role === "AGENT"
          ? { agentId: user.agentId ?? "__NO_AGENT__" }
          : {};

    /*
     * Branch employees only see shipments where their
     * assigned branch participates as either:
     *
     *   Origin Working
     *   OR
     *   Destination Working
     *
     * ADMIN and other existing roles keep their
     * current visibility rules.
     */
    const branchCode =
      user.role === "EMPLOYEE"
        ? user.branch?.code?.trim().toUpperCase()
        : null;

    const branchScope =
      user.role === "EMPLOYEE"
        ? branchCode
          ? {
              OR: [
                { origin: branchCode },
                { destination: branchCode },
              ],
            }
          : {
              // Employee without an assigned branch
              // must not receive shipment data.
              id: "__NO_BRANCH__",
            }
        : {};

    const shipments = await prisma.shipment.findMany({
      where: {
        ...ownerScope,

        AND: [
          branchScope,
        ],

        ...(tracking
          ? {
              trackingNumber: {
                contains: tracking,
                mode: "insensitive",
              },
            }
          : {}),

        ...(mobile
          ? {
              OR: [
                {
                  senderPhone: {
                    contains: mobile,
                  },
                },
                {
                  receiverPhone: {
                    contains: mobile,
                  },
                },
              ],
            }
          : {}),

        ...(origin ? { origin } : {}),
        ...(destination ? { destination } : {}),
        ...(status ? { status: status as any } : {}),
      },

      include: {
        packages: true,

        deliveryChallans: {
          include: {
            challan: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const responseShipments =
      shipments.map((shipment) => {

        const workflow =
          user.role === "EMPLOYEE" &&
          branchCode
            ? getShipmentWorkflow(
                branchCode,
                shipment,
              )
            : {};

        const activeDeliveryChallan =
          shipment.deliveryChallans.find(
            (entry) =>
              entry.challan.status === "OPEN"
          );

        return {
          ...shipment,
          ...workflow,

          hasDeliveryChallan:
            !!activeDeliveryChallan,

          deliveryChallanNumber:
            activeDeliveryChallan
              ?.challan
              .challanNumber ?? null,
        };
      });

    return NextResponse.json(
      responseShipments
    );
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Unable to fetch dockets." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole([
      "ADMIN",
      "CLIENT",
      "AGENT",
      "EMPLOYEE",
      "BOOKING",
    ]);

    const body = await request.json();

    /*
     * Branch employee booking rule:
     * the employee's assigned branch is always
     * the origin of a newly created shipment.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode = getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error:
              "Your user account is not assigned to a branch.",
          },
          { status: 403 }
        );
      }

      // Server-side source of truth.
      // Do not trust an origin supplied by the browser.
      body.origin = branchCode;
    }

    if (!body.customerId) {
      return NextResponse.json(
        { error: "Customer ID is required." },
        { status: 400 },
      );
    }

    const customer =
      await prisma.customer.findFirst({
        where: {
          id: body.customerId,
          status: "ACTIVE",
        },
      });

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "A valid active Customer ID is required.",
        },
        { status: 400 },
      );
    }

    const shipment = await ShipmentService.create(
      body,
      {
        clientId:
          user.role === "CLIENT"
            ? user.clientId
            : null,

        agentId:
          user.role === "AGENT"
            ? user.agentId
            : null,

        createdByUserId: user.id,
      }
    );

    return NextResponse.json(
      shipment,
      { status: 201 }
    );
  } catch (error: any) {
    if (
      error?.message === "UNAUTHORIZED" ||
      error?.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to create docket.",
      },
      { status: 500 }
    );
  }
}
