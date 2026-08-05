import { NextRequest, NextResponse } from "next/server";
import { generateTrackingNumber } from "@/lib/docket/generateTrackingNumber";

export async function GET(request: NextRequest) {

  const origin =
    request.nextUrl.searchParams.get("origin");

  if (!origin) {

    return NextResponse.json(
      {
        error: "Origin is required.",
      },
      {
        status: 400,
      },
    );

  }

  const trackingNumber =
    await generateTrackingNumber(origin, "");

  return NextResponse.json({
    trackingNumber,
  });

}
