import { NextRequest, NextResponse } from "next/server";
import { previewAwbNumber } from "@/lib/airwaybill/previewAwbNumber";

export async function GET(request: NextRequest) {
  const airlineId =
    request.nextUrl.searchParams.get("airlineId");

  if (!airlineId) {
    return NextResponse.json(
      { error: "Airline is required." },
      { status: 400 },
    );
  }

  try {
    const trackingNumber =
      await previewAwbNumber(airlineId);

    return NextResponse.json({
      trackingNumber,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to preview AWB.",
      },
      { status: 400 },
    );
  }
}
