import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ManifestService } from "@/lib/services/manifest.service";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);

  const manifestNumber = searchParams.get("manifestNumber") ?? "";

  const manifests = await prisma.manifest.findMany({

    where: {
      manifestNumber: {
        contains: manifestNumber,
        mode: "insensitive",
      },
    },

    include: {
      shipments: {
        include: {
          shipment: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

  });

  return NextResponse.json(manifests);

}

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    const manifest = await ManifestService.create(body);

    return NextResponse.json(manifest, {
      status: 201,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );

  }

}
