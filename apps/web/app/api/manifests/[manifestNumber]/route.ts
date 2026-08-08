import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      manifestNumber: string;
    }>;
  }
) {

  const { manifestNumber } = await params;

  const manifest = await prisma.manifest.findUnique({

    where: {
      manifestNumber,
    },

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

      loadingTally: true,

    },

  });

  if (!manifest) {

    return NextResponse.json(
      {
        error: "Manifest not found",
      },
      {
        status: 404,
      }
    );

  }

  return NextResponse.json(manifest);

}
