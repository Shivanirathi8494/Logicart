import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { getPaymentConfiguration } from "@/lib/payments";

export async function GET() {
  try {
    await requireRole(["CLIENT"]);

    const config = getPaymentConfiguration();

    /*
     * Never return gateway secrets from this endpoint.
     */
    return NextResponse.json({
      onlinePayment: {
        enabled: config.enabled && Boolean(config.provider),

        provider: config.enabled && config.provider ? config.provider : null,

        supportedMethods: ["UPI", "CARD", "NET_BANKING"],
      },
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (error?.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        {
          status: 403,
        },
      );
    }

    console.error("Unable to load payment configuration:", error);

    return NextResponse.json(
      {
        error: "Unable to load payment configuration.",
      },
      {
        status: 500,
      },
    );
  }
}
