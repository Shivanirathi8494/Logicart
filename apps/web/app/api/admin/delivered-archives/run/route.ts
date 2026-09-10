import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { createLastCompletedDeliveredArchive } from "@/lib/archive/createArchive";

export const runtime = "nodejs";

export async function POST() {
  try {
    await requireRole(["ADMIN"]);

    const result = await createLastCompletedDeliveredArchive();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Delivered archive creation failed:", error);

    const message =
      error instanceof Error ? error.message : "Archive creation failed.";

    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
