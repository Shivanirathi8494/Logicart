import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    /*
     * Internal booking users may select the commercial
     * Client account that owns the shipment.
     *
     * IMPORTANT:
     * Do not expose wallet balance or commercial rates here.
     */
    await requireRole(["ADMIN", "EMPLOYEE", "BOOKING"]);

    const clients = await prisma.client.findMany({
      where: {
        status: "ACTIVE",
      },

      select: {
        id: true,
        code: true,
        companyName: true,
        billingType: true,
      },

      orderBy: [
        {
          code: "asc",
        },
      ],
    });

    return NextResponse.json(clients);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        {
          status: 403,
        },
      );
    }

    console.error("Unable to load active clients:", error);

    return NextResponse.json(
      {
        error: "Unable to load active clients.",
      },
      {
        status: 500,
      },
    );
  }
}
