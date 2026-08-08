import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    const shipments = await prisma.shipment.findMany({

      where: {

        trackingNumber: {
          in: body.trackingNumbers,
        },

      },

    });

    if (shipments.length === 0) {

      return NextResponse.json(
        {
          error: "No shipments found.",
        },
        {
          status: 404,
        }
      );

    }

    const manifestCount = await prisma.manifest.count();

    const manifestNumber =
      "MNF-" +
      body.origin +
      "-" +
      body.destination +
      "-" +
      new Date().toISOString().slice(2,10).replace(/-/g,"") +
      "-" +
      String(manifestCount + 1).padStart(6,"0");

    const manifest = await prisma.manifest.create({

      data:{

        manifestNumber,

        manifestDate:new Date(),

        origin:body.origin,

        destination:body.destination,

        loadingTallyId:body.loadingTallyId,

        remarks:
          "Generated from " +
          body.loadingTallyNumber,

        shipments:{
          create:shipments.map(s=>({
            shipmentId:s.id,
          })),
        },

      },

      include:{
        shipments:true,
      },

    });

    await prisma.shipment.updateMany({

      where:{
        id:{
          in:shipments.map(s=>s.id),
        },
      },

      data:{
        status:"MANIFESTED",
      },

    });

    await prisma.loadingTallyShipment.updateMany({

      where:{
        loadingTallyId:body.loadingTallyId,

        shipmentId:{
          in:shipments.map(s=>s.id),
        },

      },

      data:{
        manifestId:manifest.id,
      },

    });


// Close the Loading Tally only when every shipment
// in that tally has been assigned to a Manifest.
const remainingShipments =
  await prisma.loadingTallyShipment.count({
    where: {
      loadingTallyId: body.loadingTallyId,
      manifestId: null,
    },
  });

if (remainingShipments === 0) {
  await prisma.loadingTally.update({
    where: {
      id: body.loadingTallyId,
    },
    data: {
      status: "COMPLETED",
    },
  });
}

return NextResponse.json(manifest);

  } catch(error){

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
