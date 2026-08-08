import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(){

  const tallies = await prisma.loadingTally.findMany({

    where:{
      status:"OPEN",
    },

    include:{
      shipments:true,
    },

    orderBy:{
      loadingDate:"desc",
    },

  });

  return NextResponse.json(tallies);

}
