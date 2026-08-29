import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await requireRole(["CLIENT"]);

    if (!user.clientId) {
      return NextResponse.json(
        {
          error: "Your user account is not linked to a Client ID.",
        },
        { status: 400 },
      );
    }

    const url = new URL(request.url);

    const origin = String(url.searchParams.get("origin") || "")
      .trim()
      .toUpperCase();

    const destination = String(url.searchParams.get("destination") || "")
      .trim()
      .toUpperCase();

    if (!origin || !destination) {
      return NextResponse.json({
        serviceTypes: [],
      });
    }

    const now = new Date();

    const routes = await prisma.clientRateRoute.findMany({
      where: {
        origin,
        destination,

        rateContract: {
          clientId: user.clientId,
          status: "ACTIVE",

          effectiveFrom: {
            lte: now,
          },

          OR: [
            {
              effectiveUntil: null,
            },
            {
              effectiveUntil: {
                gte: now,
              },
            },
          ],
        },
      },

      select: {
        serviceType: true,
      },
    });

    const serviceTypes = [
      ...new Set(
        routes
          .map((route) =>
            String(route.serviceType || "")
              .trim()
              .toUpperCase(),
          )
          .filter(Boolean),
      ),
    ].sort();

    return NextResponse.json({
      origin,
      destination,
      serviceTypes,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED" || error?.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        { status: 403 },
      );
    }

    console.error("Client service types GET failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load contracted service types.",
      },
      { status: 500 },
    );
  }
}
