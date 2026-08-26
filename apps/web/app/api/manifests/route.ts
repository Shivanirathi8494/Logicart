import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  getUserBranchCode,
  requireUser,
} from "@/lib/auth/authorization";

export async function GET() {
  try {
    const user = await requireUser();

    /*
     * Branch employees should only see manifests
     * arriving at their assigned branch.
     *
     * Example:
     * BLR employee -> destination = BLR
     */
    const branchCode =
      user.role === "EMPLOYEE"
        ? getUserBranchCode(user)
        : null;

    if (user.role === "EMPLOYEE" && !branchCode) {
      return NextResponse.json(
        {
          error:
            "Your user account is not assigned to a branch.",
        },
        { status: 403 }
      );
    }

    const manifests = await prisma.manifest.findMany({
      where:
        user.role === "EMPLOYEE"
          ? {
              destination: branchCode!,

              /*
               * Incoming / Unload only shows pending
               * destination work.
               */
              shipments: {
                some: {
                  shipment: {
                    status: "MANIFESTED",
                  },
                },
              },
            }
          : undefined,

      include: {
        shipments: {
          include: {
            shipment: {
              include: {
                packages: true,
              },
            },
          },
        },
      },

      orderBy: {
        manifestDate: "desc",
      },
    });

    return NextResponse.json(manifests);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Unable to load manifests." },
      { status: 500 }
    );
  }
}
