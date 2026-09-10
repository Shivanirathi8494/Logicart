import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { getArchive, verifyArchive } from "@/lib/archive/storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    archiveId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireRole(["ADMIN"]);

    const { archiveId } = await context.params;

    const archive = await prisma.deliveredArchive.findUnique({
      where: {
        id: archiveId,
      },
    });

    if (!archive) {
      return NextResponse.json(
        { error: "Archive not found." },
        { status: 404 },
      );
    }

    if (
      archive.status !== "VERIFIED" ||
      !archive.archiveKey ||
      !archive.checksum ||
      !archive.fileName
    ) {
      return NextResponse.json(
        { error: "Archive is not verified and cannot be downloaded." },
        { status: 409 },
      );
    }

    const expectedSize =
      archive.fileSize === null ? undefined : Number(archive.fileSize);

    const verification = await verifyArchive(
      archive.archiveKey,
      archive.checksum,
      expectedSize,
    );

    if (!verification.verified) {
      return NextResponse.json(
        {
          error:
            "Stored archive failed integrity verification. Download blocked.",
        },
        { status: 409 },
      );
    }

    const data = await getArchive(archive.archiveKey);

    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${archive.fileName}"`,
        "Content-Length": String(data.length),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Delivered archive download failed:", error);

    const message =
      error instanceof Error ? error.message : "Archive download failed.";

    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
