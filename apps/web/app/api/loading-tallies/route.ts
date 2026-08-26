import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tallies = await prisma.loadingTally.findMany({
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
      packages: {
        include: {
          package: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tallies);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const shipmentIds: string[] = Array.isArray(body.shipmentIds)
      ? [
          ...new Set<string>(
            body.shipmentIds
              .filter(
                (id: unknown): id is string =>
                  typeof id === "string" && id.trim().length > 0
              )
              .map((id: string) => id.trim())
          ),
        ]
      : [];

    const packageSelections: {
      packageId: string;
      loaded: boolean;
      remarks?: string;
    }[] = Array.isArray(body.packages)
      ? body.packages
          .filter((item: any) => item?.packageId)
          .map((item: any) => ({
            packageId: String(item.packageId),
            loaded: item.loaded !== false,
            remarks: String(item.remarks ?? "").trim(),
          }))
      : [];

    if (!shipmentIds.length) {
      return NextResponse.json(
        {
          error: "No shipments selected.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Load the AWBs AND their individual packages.
     */
    const shipments = await prisma.shipment.findMany({
      where: {
        id: {
          in: shipmentIds,
        },
      },
      select: {
        id: true,
        trackingNumber: true,
        origin: true,
        destination: true,
        status: true,
        packages: {
          select: {
            id: true,
            shipmentId: true,
            weight: true,
            length: true,
            width: true,
            height: true,
          },
        },
      },
    });

    if (shipments.length !== shipmentIds.length) {
      return NextResponse.json(
        {
          error: "One or more selected AWBs were not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Only INSCAN AWBs can enter Loading Tally.
     */
    const unavailable = shipments.filter(
      (shipment) => shipment.status !== "INSCAN",
    );

    if (unavailable.length) {
      return NextResponse.json(
        {
          error: "Only INSCAN AWBs can be added to a Loading Tally.",
          awbs: unavailable.map((shipment) => shipment.trackingNumber),
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Validate any package IDs received from the browser.
     * A user must never be able to attach a package belonging
     * to some other AWB to this Loading Tally.
     */
    const validPackageIds = new Set(
      shipments.flatMap((shipment) => shipment.packages.map((pkg) => pkg.id)),
    );

    const invalidPackageIds = packageSelections
      .map((item) => item.packageId)
      .filter((id) => !validPackageIds.has(id));

    if (invalidPackageIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more selected packages do not belong to the selected AWBs.",
          packageIds: invalidPackageIds,
        },
        {
          status: 400,
        },
      );
    }

    /*
     * If the new UI hasn't sent package selections yet,
     * default every package to loaded.
     *
     * This keeps the existing web flow backward compatible.
     */
    const effectivePackageSelections =
      packageSelections.length > 0
        ? packageSelections
        : shipments.flatMap((shipment) =>
            shipment.packages.map((pkg) => ({
              packageId: pkg.id,
              loaded: true,
              remarks: "",
            })),
          );

    /*
     * A not-loaded piece requires a remark.
     */
    const missingRemarks = effectivePackageSelections.filter(
      (item) => !item.loaded && !String(item.remarks ?? "").trim(),
    );

    if (missingRemarks.length) {
      return NextResponse.json(
        {
          error:
            "Remarks are required for every piece that is not being loaded.",
        },
        {
          status: 400,
        },
      );
    }

    const firstShipment = shipments[0];

    const loadingTallyNumber =
      "LT-" + firstShipment.origin + "-" + firstShipment.trackingNumber;

    const existingTally = await prisma.loadingTally.findUnique({
      where: {
        loadingTallyNumber,
      },
    });

    if (existingTally) {
      return NextResponse.json(
        {
          error: "Loading Tally already exists.",
          loadingTallyNumber,
          id: existingTally.id,
        },
        {
          status: 409,
        },
      );
    }

    /*
     * Save AWBs and piece-level loading decisions
     * atomically.
     */
    const tally = await prisma.loadingTally.create({
      data: {
        loadingTallyNumber,

        loadingDate: new Date(body.loadingDate || new Date()),

        remarks: body.remarks ?? "",

        shipments: {
          create: shipmentIds.map((id: string) => ({
            shipmentId: id,
          })),
        },

        packages: {
          create: effectivePackageSelections.map((item) => ({
            packageId: item.packageId,
            loaded: item.loaded,
            remarks: item.remarks?.trim() || null,
          })),
        },
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

        packages: {
          include: {
            package: true,
          },
        },
      },
    });

    return NextResponse.json(tally, {
      status: 201,
    });
  } catch (error) {
    console.error("Unable to create Loading Tally:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      },
    );
  }
}
