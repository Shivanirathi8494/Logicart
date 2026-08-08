import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const tallies = await prisma.loadingTally.findMany({

    include:{
      shipments:{
        include:{
          shipment:true,
        },
      },
    },

    orderBy:{
      createdAt:"desc",
    },

  });

  return NextResponse.json(tallies);

}

export async function POST(request: NextRequest){

  try{

    const body = await request.json();

    const tally = await prisma.loadingTally.create({

      data:{

        loadingTallyNumber:body.loadingTallyNumber,

        loadingDate:new Date(body.loadingDate),

        remarks:body.remarks ?? "",

        shipments:{
          create:body.shipmentIds.map((id:string)=>({
            shipmentId:id,
          })),
        },

      },

      include:{
        shipments:{
          include:{
            shipment:true,
          },
        },
      },

    });

    return NextResponse.json(tally,{
      status:201,
    });

  }catch(error){

    console.error(error);

    return NextResponse.json(
      {
        error:String(error),
      },
      {
        status:500,
      }
    );

  }

}
