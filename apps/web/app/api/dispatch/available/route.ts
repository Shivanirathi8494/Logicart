import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  getUserBranchCode,
  requireUser,
} from "@/lib/auth/authorization";

export async function GET() {
  try {
    const user = await requireUser();

    const branchCode = getUserBranchCode(user);

    if (!branchCode) {
      return NextResponse.json(
        {
          error: "Your user account is not assigned to a branch.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Dispatch rule:
     *
     * A shipment is available for dispatch only when:
     *
     * 1. It belongs to the operator's ORIGIN branch.
     * 2. It is currently INSCAN.
     * 3. It is not already part of an OPEN Loading Tally.
     * 4. It has not already been placed in a Manifest.
     */

    const shipments = await prisma.shipment.findMany({
      where: {
        origin: branchCode,

        status: "INSCAN",

        /*
         * Exclude shipments already saved in an OPEN
         * Loading Tally.
         */
        loadingTallies: {
          none: {
            loadingTally: {
              status: "OPEN",
            },
          },
        },

        /*
         * Exclude anything already manifested.
         */
        manifestEntries: {
          none: {},
        },
      },

      include: {
        packages: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(shipments);
  } catch (error: any) {
    console.error(
      "Unable to load dispatch shipments:",
      error
    );

    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Unable to load shipments ready for dispatch.",
      },
      {
        status: 500,
      }
    );
  }
}
