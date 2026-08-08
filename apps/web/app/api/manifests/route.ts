import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const manifests = await prisma.manifest.findMany({

    include: {
      shipments: {
        include: {
          shipment: {
            include: {
              packages: true,
            },
          },
        },
      },
    },

    orderBy: {
      manifestDate: "desc",
    },

  });

  return NextResponse.json(manifests);

}
