import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const [
    booked,
    inscan,
    manifested,
    outscan,
    delivered,
    revenue,
    recentShipments,
    recentManifests,
    openManifests,
    openChallans,
  ] = await Promise.all([

    prisma.shipment.count({
      where:{
        status:"BOOKED",
      },
    }),

    prisma.shipment.count({
      where:{
        status:"INSCAN",
      },
    }),

    prisma.shipment.count({
      where:{
        status:"MANIFESTED",
      },
    }),

    prisma.shipment.count({
      where:{
        status:"OUTSCAN",
      },
    }),

    prisma.shipment.count({
      where:{
        status:"DELIVERED",
      },
    }),

    prisma.shipment.aggregate({
      _sum:{
        total:true,
      },
    }),

    prisma.shipment.findMany({

      orderBy:{
        createdAt:"desc",
      },

      take:10,

    }),

    prisma.manifest.findMany({

      orderBy:{
        createdAt:"desc",
      },

      take:5,

      include:{
        shipments:true,
      },

    }),

    prisma.manifest.count({

      where:{
        status:"OPEN",
      },

    }),

    prisma.deliveryChallan.count({

      where:{
        status:"OPEN",
      },

    }),

  ]);

  return NextResponse.json({

    booked,

    inscan,

    manifested,

    outscan,

    delivered,

    revenue:revenue._sum.total ?? 0,

    recentShipments,

    recentManifests,

    openManifests,

    openChallans,

  });

}
