import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

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
      where:{
        status:"OUTSCAN",
      },
    }),

    prisma.shipment.count({
      where:{
        status:"DELIVERED",
      },
    }),

    prisma.shipment.count({
      where:{
        status:"OUTSCAN",
      },
    }),

    prisma.shipment.aggregate({
      _sum:{
        total:true,
      },
    }),

  ]);

  return NextResponse.json({

    businessDate:new Date(),

    branch:"Bangalore",

    bookingCount,

    manifestCount,

    outscanCount,

    deliveredCount,

    pendingDelivery,

    revenue:revenue._sum.total ?? 0,

    cashCollection:0,

    onlineCollection:revenue._sum.total ?? 0,

  });

}
