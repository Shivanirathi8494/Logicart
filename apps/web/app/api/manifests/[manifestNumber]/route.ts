import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUserBranchCode, requireUser } from "@/lib/auth/authorization";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      manifestNumber: string;
    }>;
  },
) {
  try {
    const user = await requireUser();

    const { manifestNumber } = await params;

    const manifest = await prisma.manifest.findUnique({
      where: {
        manifestNumber,
      },

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

        loadingTally: {
          include: {
            packages: {
              include: {
                package: true,
              },
            },
          },
        },

        unloadPackages: {
          include: {
            package: true,
          },
        },
      },
    });

    if (!manifest) {
      return NextResponse.json(
        {
          error: "Manifest not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Destination branch security.
     *
     * An employee can receive/unload only manifests
     * addressed to their assigned branch.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode = getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error: "Your user account is not assigned to a branch.",
          },
          { status: 403 },
        );
      }

      const manifestOrigin = manifest.origin.trim().toUpperCase();

      const manifestDestination = manifest.destination.trim().toUpperCase();

      /*
       * Employee may VIEW a manifest when their
       * branch participates as either origin
       * or destination.
       *
       * Destination-only processing permissions
       * are enforced separately by receive/unload APIs.
       */
      if (manifestOrigin !== branchCode && manifestDestination !== branchCode) {
        return NextResponse.json(
          {
            error: "This manifest does not belong to your branch.",
          },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(manifest);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error(error);

    return NextResponse.json(
      { error: "Unable to load manifest." },
      { status: 500 },
    );
  }
}
