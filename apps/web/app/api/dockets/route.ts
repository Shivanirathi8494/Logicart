import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ShipmentService } from "@/lib/services/shipment.service";
import {
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

    const shipments = await prisma.shipment.findMany({
      where: {
        ...ownerScope,

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
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(shipments);
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
