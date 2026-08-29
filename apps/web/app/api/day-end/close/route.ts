import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/authorization";

export async function POST() {
  try {
    const user = await requireUser();

    /*
     * Only administrators are allowed to
     * perform the actual business-day close.
     *
     * Branch employees may view their own
     * operational Day End summary, but they
     * must never be able to close the day.
     */
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Only an administrator can close the business day.",
        },
        {
          status: 403,
        },
      );
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const existing = await prisma.dayEnd.findFirst({
      where: {
        businessDate: today,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Business day already closed.",
        },
        {
          status: 400,
        },
      );
    }

    const [
      bookingCount,
      manifestCount,
      outscanCount,
      deliveredCount,
      pendingDelivery,
      revenue,
    ] = await Promise.all([
      prisma.shipment.count(),

      prisma.manifest.count(),

      prisma.shipment.count({
        where: {
          status: "OUTSCAN",
        },
      }),

      prisma.shipment.count({
        where: {
          status: "DELIVERED",
        },
      }),

      prisma.shipment.count({
        where: {
          status: "OUTSCAN",
        },
      }),

      prisma.shipment.aggregate({
        _sum: {
          total: true,
        },
      }),
    ]);

    const dayEnd = await prisma.dayEnd.create({
      data: {
        businessDate: today,

        branch: user.branch?.name || user.branch?.code || "ALL",

        bookingCount,

        manifestCount,

        outscanCount,

        deliveredCount,

        pendingDelivery,

        revenue: revenue._sum.total ?? 0,

        cashCollection: 0,

        onlineCollection: revenue._sum.total ?? 0,

        status: "CLOSED",

        closedBy: user.fullName || user.username || "Administrator",

        closedAt: new Date(),
      },
    });

    return NextResponse.json(dayEnd);
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
        error: error?.message || "Unable to close business day.",
      },
      {
        status: 500,
      },
    );
  }
}
