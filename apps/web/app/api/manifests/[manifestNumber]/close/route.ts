import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ manifestNumber:string }> }
){

  const { manifestNumber } = await params;

  const manifest = await prisma.manifest.update({

    where:{
      manifestNumber,
    },

    data:{
      status:"CLOSED",
    },

  });

  return NextResponse.json(manifest);

}
