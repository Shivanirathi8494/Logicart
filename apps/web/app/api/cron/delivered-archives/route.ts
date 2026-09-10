import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { createPendingDeliveredArchives } from "@/lib/archive/createArchive";

export const runtime = "nodejs";

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function authorizeCron(request: Request): boolean {
  const secret = process.env.ARCHIVE_CRON_SECRET;

  if (!secret) {
    console.error("ARCHIVE_CRON_SECRET is not configured.");
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }

  const supplied = authorization.slice("Bearer ".length);

  return secureEqual(supplied, secret);
}

async function run(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const configuredMax = Number(
      process.env.ARCHIVE_CATCHUP_MAX_PERIODS ?? "8",
    );

    const result = await createPendingDeliveredArchives(configuredMax);

    return NextResponse.json(result, {
      status: result.failed > 0 ? 500 : 200,
    });
  } catch (error) {
    console.error("Scheduled delivered archive failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Scheduled archive failed.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}
