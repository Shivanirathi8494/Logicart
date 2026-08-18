import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/authorization";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const shipmentScope =
    user.role === "CLIENT"
      ? { clientId: user.clientId ?? "__NO_CLIENT__" }
      : user.role === "AGENT"
        ? { agentId: user.agentId ?? "__NO_AGENT__" }
        : {};

  const [
    booked,
    inscan,
    manifested,
    outscan,
    delivered,
    recentShipments,
  ] = await Promise.all([
    prisma.shipment.count({
      where: { ...shipmentScope, status: "BOOKED" },
    }),

    prisma.shipment.count({
      where: { ...shipmentScope, status: "INSCAN" },
    }),

    prisma.shipment.count({
      where: { ...shipmentScope, status: "MANIFESTED" },
    }),

    prisma.shipment.count({
      where: { ...shipmentScope, status: "OUTSCAN" },
    }),

    prisma.shipment.count({
      where: { ...shipmentScope, status: "DELIVERED" },
    }),

    prisma.shipment.findMany({
      where: shipmentScope,
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const externalUser =
    user.role === "CLIENT" || user.role === "AGENT";

  let recentManifests: unknown[] = [];
  let openManifests = 0;
  let openChallans = 0;

  if (!externalUser) {
    [
      recentManifests,
      openManifests,
      openChallans,
    ] = await Promise.all([
      prisma.manifest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { shipments: true },
      }),

      prisma.manifest.count({
        where: { status: "OPEN" },
      }),

      prisma.deliveryChallan.count({
        where: { status: "OPEN" },
      }),
    ]);
  }

  let revenue: number | undefined;

  if (user.role === "ADMIN") {
    const result = await prisma.shipment.aggregate({
      _sum: { total: true },
    });

    revenue = result._sum.total ?? 0;
  }

  return NextResponse.json({
    booked,
    inscan,
    manifested,
    outscan,
    delivered,

    ...(user.role === "ADMIN"
      ? { revenue }
      : {}),

    recentShipments,
    recentManifests,
    openManifests,
    openChallans,
  });
}
