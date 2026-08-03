import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {

  const today = new Date();

  today.setHours(0,0,0,0);

  const existing = await prisma.dayEnd.findFirst({

    where:{
      businessDate:today,
    },

  });

  if(existing){

    return NextResponse.json(
      {
        error:"Business day already closed.",
      },
      {
        status:400,
      }
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

  const dayEnd = await prisma.dayEnd.create({

    data:{

      businessDate:today,

      branch:"Bangalore",

      bookingCount,

      manifestCount,

      outscanCount,

      deliveredCount,

      pendingDelivery,

      revenue:revenue._sum.total ?? 0,

      cashCollection:0,

      onlineCollection:revenue._sum.total ?? 0,

      status:"CLOSED",

      closedBy:"Admin",

      closedAt:new Date(),

    },

  });

  return NextResponse.json(dayEnd);

}
