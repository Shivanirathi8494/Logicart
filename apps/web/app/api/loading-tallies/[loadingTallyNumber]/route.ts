import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      loadingTallyNumber:string;
    }>;
  }
){

  const { loadingTallyNumber } = await params;

  const tally = await prisma.loadingTally.findUnique({

    where:{
      loadingTallyNumber,
    },

    include:{
      shipments:{
        include:{
          shipment:true,
          manifest:true,
        },
      },
    },

  });

  if(!tally){

    return NextResponse.json(
      {
        error:"Loading Tally not found.",
      },
      {
        status:404,
      }
    );

  }

  return NextResponse.json(tally);

}
