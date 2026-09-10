import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);

    const archives = await prisma.deliveredArchive.findMany({
      orderBy: {
        periodStart: "desc",
      },
      include: {
        shipments: {
          select: {
            trackingNumber: true,
            archivedAt: true,
          },
          orderBy: {
            trackingNumber: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      archives: archives.map((archive) => ({
        id: archive.id,
        periodStart: archive.periodStart,
        periodEnd: archive.periodEnd,
        shipmentCount: archive.shipmentCount,
        archiveKey: archive.archiveKey,
        fileName: archive.fileName,
        fileSize:
          archive.fileSize === null ? null : archive.fileSize.toString(),
        checksum: archive.checksum,
        status: archive.status,
        failureReason: archive.failureReason,
        createdAt: archive.createdAt,
        updatedAt: archive.updatedAt,
        verifiedAt: archive.verifiedAt,
        shipments: archive.shipments,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load archives.";

    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
