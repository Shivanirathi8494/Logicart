import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUserBranchCode, requireUser } from "@/lib/auth/authorization";

/*
 * Logicarts currently operates Indian airport branches.
 *
 * Day End therefore uses the India business day
 * rather than the server/Vercel UTC calendar day.
 */
function getIstBusinessDay() {
  const IST_OFFSET_MINUTES = 330;

  const now = new Date();

  const istNow = new Date(now.getTime() + IST_OFFSET_MINUTES * 60 * 1000);

  const year = istNow.getUTCFullYear();

  const month = istNow.getUTCMonth();

  const day = istNow.getUTCDate();

  const startUtc = new Date(
    Date.UTC(year, month, day) - IST_OFFSET_MINUTES * 60 * 1000,
  );

  const endUtc = new Date(
    Date.UTC(year, month, day + 1) - IST_OFFSET_MINUTES * 60 * 1000,
  );

  return {
    start: startUtc,
    end: endUtc,
  };
}

export async function GET() {
  try {
    const user = await requireUser();

    if (user.role !== "ADMIN" && user.role !== "EMPLOYEE") {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    const businessDay = getIstBusinessDay();

    /*
     * =====================================================
     * ADMIN
     *
     * Admin sees today's company-wide activity for
     * every airport/branch.
     * =====================================================
     */
    if (user.role === "ADMIN") {
      const [
        bookingCount,
        manifestCount,
        outscanCount,
        deliveredCount,
        pendingDelivery,
        revenue,
      ] = await Promise.all([
        /*
         * Today's bookings across all airports.
         */
        prisma.shipment.count({
          where: {
            bookingDate: {
              gte: businessDay.start,

              lt: businessDay.end,
            },
          },
        }),

        /*
         * Today's manifests across all airports.
         */
        prisma.manifest.count({
          where: {
            manifestDate: {
              gte: businessDay.start,

              lt: businessDay.end,
            },
          },
        }),

        /*
         * Shipments currently in OUTSCAN which
         * had operational activity today.
         */
        prisma.shipment.count({
          where: {
            status: "OUTSCAN",

            updatedAt: {
              gte: businessDay.start,

              lt: businessDay.end,
            },
          },
        }),

        /*
         * Deliveries completed today.
         */
        prisma.shipment.count({
          where: {
            status: "DELIVERED",

            updatedAt: {
              gte: businessDay.start,

              lt: businessDay.end,
            },
          },
        }),

        /*
         * Current final-mile workload that had
         * activity today.
         */
        prisma.shipment.count({
          where: {
            status: {
              in: ["RECEIVED", "OUTSCAN", "OUT_FOR_DELIVERY"],
            },

            updatedAt: {
              gte: businessDay.start,

              lt: businessDay.end,
            },
          },
        }),

        /*
         * Revenue from shipments booked today.
         */
        prisma.shipment.aggregate({
          where: {
            bookingDate: {
              gte: businessDay.start,

              lt: businessDay.end,
            },
          },

          _sum: {
            total: true,
          },
        }),
      ]);

      return NextResponse.json({
        businessDate: businessDay.start,

        branch: "ALL",

        bookingCount,
        manifestCount,
        outscanCount,
        deliveredCount,
        pendingDelivery,

        revenue: revenue._sum.total ?? 0,

        cashCollection: 0,

        onlineCollection: revenue._sum.total ?? 0,

        canViewFinancials: true,
        canCloseDay: true,
      });
    }

    /*
     * =====================================================
     * AIRPORT EMPLOYEE
     *
     * Example:
     *
     * DEL employee sees only DEL operational activity.
     * BLR employee sees only BLR operational activity.
     *
     * No financial values are returned.
     * =====================================================
     */
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

    const [
      bookingCount,
      manifestCount,
      outscanCount,
      deliveredCount,
      pendingDelivery,
    ] = await Promise.all([
      /*
       * Shipments booked from this airport today.
       *
       * DEL operator:
       * origin = DEL only.
       */
      prisma.shipment.count({
        where: {
          origin: branchCode,

          bookingDate: {
            gte: businessDay.start,

            lt: businessDay.end,
          },
        },
      }),

      /*
       * Manifest activity involving the airport.
       *
       * This lets an airport see both:
       * - manifests dispatched from the branch
       * - manifests arriving at the branch
       */
      prisma.manifest.count({
        where: {
          OR: [
            {
              origin: branchCode,
            },

            {
              destination: branchCode,
            },
          ],

          manifestDate: {
            gte: businessDay.start,

            lt: businessDay.end,
          },
        },
      }),

      /*
       * Final-mile OUTSCAN belongs to destination branch.
       */
      prisma.shipment.count({
        where: {
          destination: branchCode,

          status: "OUTSCAN",

          updatedAt: {
            gte: businessDay.start,

            lt: businessDay.end,
          },
        },
      }),

      /*
       * Deliveries completed today at this branch.
       */
      prisma.shipment.count({
        where: {
          destination: branchCode,

          status: "DELIVERED",

          updatedAt: {
            gte: businessDay.start,

            lt: businessDay.end,
          },
        },
      }),

      /*
       * Current destination delivery workload.
       */
      prisma.shipment.count({
        where: {
          destination: branchCode,

          status: {
            in: ["RECEIVED", "OUTSCAN", "OUT_FOR_DELIVERY"],
          },

          updatedAt: {
            gte: businessDay.start,

            lt: businessDay.end,
          },
        },
      }),
    ]);

    return NextResponse.json({
      businessDate: businessDay.start,

      branch: branchCode,

      bookingCount,
      manifestCount,
      outscanCount,
      deliveredCount,
      pendingDelivery,

      /*
       * Intentionally NO:
       *
       * revenue
       * cashCollection
       * onlineCollection
       *
       * Operator browsers must never receive
       * company financial information.
       */
      canViewFinancials: false,
      canCloseDay: false,
    });
  } catch (error: any) {
    console.error("Day End error:", error);

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
        error: "Unable to load Day End summary.",
      },
      {
        status: 500,
      },
    );
  }
}
