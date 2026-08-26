import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUserBranchCode, requireUser } from "@/lib/auth/authorization";

type PackageInput = {
  packageId: string;
  unloaded: boolean;
  remarks?: string | null;
};

export async function POST(
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

    const body = await request.json();

    const packages: PackageInput[] = Array.isArray(body.packages)
      ? body.packages.filter((item: unknown): item is PackageInput => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const value = item as Record<string, unknown>;

          return (
            typeof value.packageId === "string" &&
            typeof value.unloaded === "boolean"
          );
        })
      : [];

    if (packages.length === 0) {
      return NextResponse.json(
        {
          error: "At least one package is required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * A remark is mandatory whenever a manifested
     * package is not physically unloaded.
     */
    const missingRemark = packages.find(
      (item) => !item.unloaded && !String(item.remarks || "").trim(),
    );

    if (missingRemark) {
      return NextResponse.json(
        {
          error: "Remarks are required for every package that is not unloaded.",
        },
        {
          status: 400,
        },
      );
    }

    const manifest = await prisma.manifest.findUnique({
      where: {
        manifestNumber,
      },

      include: {
        loadingTally: {
          include: {
            packages: true,
          },
        },

        shipments: true,
      },
    });

    if (!manifest) {
      return NextResponse.json(
        {
          error: "Manifest not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Receiving/unloading is a destination operation.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode = getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error: "Your user account is not assigned to a branch.",
          },
          {
            status: 403,
          },
        );
      }

      if (manifest.destination.trim().toUpperCase() !== branchCode) {
        return NextResponse.json(
          {
            error:
              "This manifest can only be unloaded at its destination branch.",
          },
          {
            status: 403,
          },
        );
      }
    }

    if (!manifest.loadingTally) {
      return NextResponse.json(
        {
          error: "This manifest does not have a loading tally.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Only packages physically loaded at origin are
     * valid destination-unload packages.
     */
    const loadedPackageIds = new Set(
      manifest.loadingTally.packages
        .filter((item) => item.loaded)
        .map((item) => item.packageId),
    );

    const invalidPackage = packages.find(
      (item) => !loadedPackageIds.has(item.packageId),
    );

    if (invalidPackage) {
      return NextResponse.json(
        {
          error: "One or more packages were not loaded on this manifest.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Incoming verification must account for every
     * piece that left the origin.
     */
    if (packages.length !== loadedPackageIds.size) {
      return NextResponse.json(
        {
          error:
            "Please verify every manifested package before completing unload.",
        },
        {
          status: 400,
        },
      );
    }

    const submittedPackageIds = new Set(packages.map((item) => item.packageId));

    if (submittedPackageIds.size !== packages.length) {
      return NextResponse.json(
        {
          error: "Duplicate package entries are not allowed.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.$transaction(
      packages.map((item) =>
        prisma.manifestUnloadPackage.upsert({
          where: {
            manifestId_packageId: {
              manifestId: manifest.id,
              packageId: item.packageId,
            },
          },

          create: {
            manifestId: manifest.id,
            packageId: item.packageId,
            unloaded: item.unloaded,
            remarks: String(item.remarks || "").trim() || null,
          },

          update: {
            unloaded: item.unloaded,
            remarks: String(item.remarks || "").trim() || null,
          },
        }),
      ),
    );

    /*
     * Calculate destination result from the physical
     * package selections.
     */
    const unloadedCount = packages.filter((item) => item.unloaded).length;

    const missingCount = packages.length - unloadedCount;

    /*
     * Preserve AWB-level RECEIVED behavior only when
     * every manifested piece belonging to that AWB
     * has been unloaded.
     *
     * Package-level records remain the source of truth
     * for partial unloading.
     */
    const packageRecords = await prisma.shipmentPackage.findMany({
      where: {
        id: {
          in: Array.from(loadedPackageIds),
        },
      },

      select: {
        id: true,
        shipmentId: true,
        weight: true,
      },
    });

    const submittedMap = new Map(
      packages.map((item) => [item.packageId, item]),
    );

    const shipmentPackageMap = new Map<string, typeof packageRecords>();

    for (const pkg of packageRecords) {
      const current = shipmentPackageMap.get(pkg.shipmentId) || [];

      current.push(pkg);

      shipmentPackageMap.set(pkg.shipmentId, current);
    }

    const fullyReceivedShipmentIds: string[] = [];

    for (const [shipmentId, shipmentPackages] of shipmentPackageMap) {
      const allUnloaded = shipmentPackages.every(
        (pkg) => submittedMap.get(pkg.id)?.unloaded === true,
      );

      if (allUnloaded) {
        fullyReceivedShipmentIds.push(shipmentId);
      }
    }

    if (fullyReceivedShipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: {
          id: {
            in: fullyReceivedShipmentIds,
          },
        },

        data: {
          status: "RECEIVED",
        },
      });
    }

    const unloadedWeight = packageRecords.reduce((sum, pkg) => {
      const result = submittedMap.get(pkg.id);

      return result?.unloaded ? sum + Number(pkg.weight || 0) : sum;
    }, 0);

    return NextResponse.json({
      success: true,

      summary: {
        totalPieces: packages.length,
        unloadedPieces: unloadedCount,
        notUnloadedPieces: missingCount,
        unloadedWeight: Number(unloadedWeight.toFixed(2)),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    console.error("Manifest unload error:", error);

    return NextResponse.json(
      {
        error: "Unable to save package unloading.",
      },
      {
        status: 500,
      },
    );
  }
}
