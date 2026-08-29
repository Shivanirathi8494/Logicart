import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { airportByCode } from "@/lib/master/airports";
import { recordShipmentTrackingEvent } from "@/lib/tracking/recordShipmentTrackingEvent";

import {
  getShipmentWorkingSide,
  getUserBranchCode,
  requireUser,
} from "@/lib/auth/authorization";

type PackageInput = {
  id?: string;
  length: number;
  width: number;
  height: number;
  weight?: number;
};

function positiveNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0 ? number : null;
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      trackingNumber: string;
    }>;
  },
) {
  try {
    const user = await requireUser();

    const { trackingNumber } = await params;

    const body = await request.json();

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },

      include: {
        packages: true,
      },
    });

    if (!shipment) {
      return NextResponse.json(
        {
          error: "Shipment not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * INSCAN is an origin operation.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode = getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error: "Your account is not assigned to a branch.",
          },
          {
            status: 403,
          },
        );
      }

      const workingSide = getShipmentWorkingSide(branchCode, shipment);

      if (workingSide !== "ORIGIN" && workingSide !== "BOTH") {
        return NextResponse.json(
          {
            error: "Only the origin branch can Inscan this shipment.",
          },
          {
            status: 403,
          },
        );
      }
    }

    if (shipment.status !== "BOOKED") {
      return NextResponse.json(
        {
          error: `Shipment must be BOOKED before Inscan. Current status: ${shipment.status}.`,
        },
        {
          status: 409,
        },
      );
    }

    const packageCount = Number(body.packageCount);

    const actualWeight = positiveNumber(body.actualWeight);

    const packages: PackageInput[] = Array.isArray(body.packages)
      ? body.packages
      : [];

    const remarks = String(body.remarks ?? "").trim();

    if (!Number.isInteger(packageCount) || packageCount <= 0) {
      return NextResponse.json(
        {
          error: "Received package count must be greater than zero.",
        },
        {
          status: 400,
        },
      );
    }

    if (actualWeight === null || actualWeight <= 0) {
      return NextResponse.json(
        {
          error: "Actual weight must be greater than zero.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Validate package dimensions.
     */
    for (const pkg of packages) {
      const length = positiveNumber(pkg.length);
      const width = positiveNumber(pkg.width);
      const height = positiveNumber(pkg.height);

      if (length === null || width === null || height === null) {
        return NextResponse.json(
          {
            error: "Package dimensions cannot contain invalid values.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * Volumetric weight:
     * L × W × H / 5000
     *
     * Preserve the existing booking value when there
     * are no package dimension rows.
     */
    const volumetricWeight =
      packages.length > 0
        ? packages.reduce(
            (total, pkg) =>
              total +
              (Number(pkg.length) * Number(pkg.width) * Number(pkg.height)) /
                5000,
            0,
          )
        : shipment.volumetricWeight;

    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    const packageChanged = packageCount !== shipment.packageCount;

    const actualWeightChanged =
      Math.abs(actualWeight - shipment.actualWeight) > 0.001;

    const dimensionsChanged =
      JSON.stringify(
        packages.map((pkg) => ({
          length: Number(pkg.length),
          width: Number(pkg.width),
          height: Number(pkg.height),
          weight: Number(pkg.weight || 0),
        })),
      ) !==
      JSON.stringify(
        shipment.packages.map((pkg) => ({
          length: Number(pkg.length),
          width: Number(pkg.width),
          height: Number(pkg.height),
          weight: Number(pkg.weight || 0),
        })),
      );

    const hasDiscrepancy =
      packageChanged || actualWeightChanged || dimensionsChanged;

    if (hasDiscrepancy && !remarks) {
      return NextResponse.json(
        {
          error:
            "Remarks are required when package count, weight or dimensions differ from the booking.",
        },
        {
          status: 400,
        },
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      /*
       * Replace dimension rows only when package
       * information was supplied by the operator.
       */
      if (packages.length > 0) {
        await tx.shipmentPackage.deleteMany({
          where: {
            shipmentId: shipment.id,
          },
        });

        await tx.shipmentPackage.createMany({
          data: packages.map((pkg) => ({
            shipmentId: shipment.id,
            length: Number(pkg.length),
            width: Number(pkg.width),
            height: Number(pkg.height),
            weight: Number(pkg.weight || 0),
          })),
        });
      }

      const updatedShipment = await tx.shipment.update({
        where: {
          id: shipment.id,
        },

        data: {
          packageCount,
          actualWeight,
          volumetricWeight,
          chargeableWeight,

          remarks: remarks || shipment.remarks,

          status: "INSCAN",
        },

        include: {
          packages: true,
          airline: true,
          customer: true,
        },
      });

      const locationCode = shipment.origin.trim().toUpperCase();

      const airport = airportByCode[locationCode];

      await recordShipmentTrackingEvent({
        db: tx,
        shipmentId: shipment.id,
        status: "INSCAN",
        locationCode,
        locationName: airport?.city ?? locationCode,
        createdByUserId: user.id ?? null,
        remarks: remarks || "Shipment received and Inscanned at origin",
      });

      return updatedShipment;
    });

    return NextResponse.json({
      success: true,
      discrepancy: hasDiscrepancy,
      shipment: updated,
    });
  } catch (error: any) {
    console.error(error);

    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        error: error?.message || "Unable to Inscan shipment.",
      },
      {
        status: 500,
      },
    );
  }
}
