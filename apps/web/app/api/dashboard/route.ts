import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  getCurrentUser,
  getUserBranchCode,
} from "@/lib/auth/authorization";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const externalUser =
    user.role === "CLIENT" ||
    user.role === "AGENT";

  const branchCode =
    user.role === "EMPLOYEE"
      ? getUserBranchCode(user)
      : null;

  if (
    user.role === "EMPLOYEE" &&
    !branchCode
  ) {
    return NextResponse.json(
      {
        error:
          "Your account is not assigned to a branch.",
      },
      { status: 403 }
    );
  }

  /*
   * Shipment visibility
   *
   * CLIENT -> own shipments
   * AGENT  -> own shipments
   * EMPLOYEE -> shipments involving working branch
   * ADMIN/other internal roles -> global
   */
  const shipmentScope: any =
    user.role === "CLIENT"
      ? {
          clientId:
            user.clientId ??
            "__NO_CLIENT__",
        }
      : user.role === "AGENT"
        ? {
            agentId:
              user.agentId ??
              "__NO_AGENT__",
          }
        : user.role === "EMPLOYEE"
          ? {
              OR: [
                { origin: branchCode! },
                { destination: branchCode! },
              ],
            }
          : {};

  /*
   * Operational status counts are intentionally
   * branch-side aware.
   *
   * Origin work:
   * BOOKED / INSCAN
   *
   * In-transit:
   * MANIFESTED
   *
   * Destination work:
   * RECEIVED / OUTSCAN / DELIVERED
   */

  const bookedWhere: any =
    user.role === "EMPLOYEE"
      ? {
          origin: branchCode!,
          status: "BOOKED",
        }
      : {
          ...shipmentScope,
          status: "BOOKED",
        };

  const inscanWhere: any =
    user.role === "EMPLOYEE"
      ? {
          origin: branchCode!,
          status: "INSCAN",
        }
      : {
          ...shipmentScope,
          status: "INSCAN",
        };

  const manifestedWhere: any =
    user.role === "EMPLOYEE"
      ? {
          status: "MANIFESTED",
          OR: [
            { origin: branchCode! },
            { destination: branchCode! },
          ],
        }
      : {
          ...shipmentScope,
          status: "MANIFESTED",
        };

  const receivedWhere: any =
    user.role === "EMPLOYEE"
      ? {
          destination: branchCode!,
          status: "RECEIVED",
        }
      : {
          ...shipmentScope,
          status: "RECEIVED",
        };

  const outscanWhere: any =
    user.role === "EMPLOYEE"
      ? {
          destination: branchCode!,
          status: "OUTSCAN",
        }
      : {
          ...shipmentScope,
          status: "OUTSCAN",
        };

  const deliveredWhere: any =
    user.role === "EMPLOYEE"
      ? {
          destination: branchCode!,
          status: "DELIVERED",
        }
      : {
          ...shipmentScope,
          status: "DELIVERED",
        };

  const [
    booked,
    inscan,
    manifested,
    received,
    outscan,
    delivered,
    totalShipment,
    recentShipments,
  ] = await Promise.all([
    prisma.shipment.count({
      where: bookedWhere,
    }),

    prisma.shipment.count({
      where: inscanWhere,
    }),

    prisma.shipment.count({
      where: manifestedWhere,
    }),

    prisma.shipment.count({
      where: receivedWhere,
    }),

    prisma.shipment.count({
      where: outscanWhere,
    }),

    prisma.shipment.count({
      where: deliveredWhere,
    }),

    prisma.shipment.count({
      where: shipmentScope,
    }),

    prisma.shipment.findMany({
      where: shipmentScope,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  let recentManifests: any[] = [];
  let openManifests = 0;
  let openChallans = 0;
  let totalManifest = 0;
  let totalChallan = 0;

  if (!externalUser) {
    const manifestScope: any =
      user.role === "EMPLOYEE"
        ? {
            OR: [
              { origin: branchCode! },
              { destination: branchCode! },
            ],
          }
        : {};

    const challanScope: any =
      user.role === "EMPLOYEE"
        ? {
            shipments: {
              some: {
                shipment: {
                  destination:
                    branchCode!,
                },
              },
            },
          }
        : {};

    [
      recentManifests,
      openManifests,
      openChallans,
      totalManifest,
      totalChallan,
    ] = await Promise.all([
      prisma.manifest.findMany({
        where: manifestScope,
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          shipments: true,
        },
      }),

      prisma.manifest.count({
        where: {
          ...manifestScope,
          status: "OPEN",
        },
      }),

      prisma.deliveryChallan.count({
        where: {
          ...challanScope,
          status: "OPEN",
        },
      }),

      prisma.manifest.count({
        where: manifestScope,
      }),

      prisma.deliveryChallan.count({
        where: challanScope,
      }),
    ]);
  }

  /*
   * At destination:
   *
   * RECEIVED = waiting for delivery processing
   * OUTSCAN  = currently out for delivery
   */
  const pendingDelivery =
    received + outscan;

  let revenue:
    | number
    | undefined;

  if (user.role === "ADMIN") {
    const result =
      await prisma.shipment.aggregate({
        _sum: {
          total: true,
        },
      });

    revenue =
      result._sum.total ?? 0;
  }

  return NextResponse.json({
    branchCode,

    booked,
    inscan,
    manifested,
    received,
    outscan,
    delivered,

    totalShipment,
    totalManifest,
    totalChallan,
    pendingDelivery,

    ...(user.role === "ADMIN"
      ? { revenue }
      : {}),

    recentShipments,
    recentManifests,
    openManifests,
    openChallans,
  });
}
