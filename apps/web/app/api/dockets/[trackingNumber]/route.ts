import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

import {
  getShipmentWorkingSide,
  getUserBranchCode,
  requireUser,
} from "@/lib/auth/authorization";

export async function GET(
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

    const { trackingNumber } =
      await params;

    const shipment =
      await prisma.shipment.findUnique({
        where: {
          trackingNumber,
        },

        include: {
          packages: true,
          airline: true,
          customer: true,
        },
      });

    if (!shipment) {
      return NextResponse.json(
        {
          error: "Shipment not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * EMPLOYEE users may only access
     * shipments relevant to their branch.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode =
        getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error:
              "Your account is not assigned to a branch.",
          },
          {
            status: 403,
          },
        );
      }

      const workingSide =
        getShipmentWorkingSide(
          branchCode,
          shipment,
        );

      if (workingSide === "NONE") {
        return NextResponse.json(
          {
            error:
              "This shipment does not belong to your branch.",
          },
          {
            status: 403,
          },
        );
      }

      return NextResponse.json({
        ...shipment,
        workingSide,
      });
    }

    return NextResponse.json(
      shipment,
    );
  } catch (error: any) {
    if (
      error?.message ===
      "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to fetch shipment.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
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

    const { trackingNumber } =
      await params;

    const body =
      await request.json();

    const shipment =
      await prisma.shipment.findUnique({
        where: {
          trackingNumber,
        },
      });

    if (!shipment) {
      return NextResponse.json(
        {
          error: "Shipment not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Branch employee editing rule:
     *
     * Only the origin branch can edit
     * shipment/docket information.
     *
     * Once manifested, origin processing
     * is considered complete.
     */
    if (user.role === "EMPLOYEE") {
      const branchCode =
        getUserBranchCode(user);

      if (!branchCode) {
        return NextResponse.json(
          {
            error:
              "Your account is not assigned to a branch.",
          },
          {
            status: 403,
          },
        );
      }

      const workingSide =
        getShipmentWorkingSide(
          branchCode,
          shipment,
        );

      if (
        workingSide !== "ORIGIN" &&
        workingSide !== "BOTH"
      ) {
        return NextResponse.json(
          {
            error:
              "Only the origin branch can update this docket.",
          },
          {
            status: 403,
          },
        );
      }

      if (
        shipment.status ===
          "MANIFESTED" ||
        shipment.status ===
          "OUTSCAN" ||
        shipment.status ===
          "DELIVERED"
      ) {
        return NextResponse.json(
          {
            error:
              "This docket can no longer be edited because origin processing is complete.",
          },
          {
            status: 409,
          },
        );
      }

      /*
       * Never allow an employee to move
       * the shipment to another origin.
       */
      body.origin =
        branchCode;

      /*
       * Don't allow an existing shipment's
       * destination to be silently changed
       * through a manipulated request.
       */
      body.destination =
        shipment.destination;
    }

    await prisma.shipmentPackage.deleteMany({
      where: {
        shipmentId:
          shipment.id,
      },
    });

    const updated =
      await prisma.shipment.update({
        where: {
          trackingNumber,
        },

        data: {
          bookingDate:
            new Date(
              body.bookingDate,
            ),

          customerId:
            body.customerId ||
            null,

          origin:
            body.origin,

          destination:
            body.destination,

          deliveryType:
            body.deliveryType === "AIRPORT_DELIVERY"
              ? "AIRPORT_DELIVERY"
              : "DOOR_TO_DOOR",

          airlineId:
            body.airlineId ||
            null,

          flightNumber:
            body.flightNumber ||
            null,

          scheduledDeparture:
            body.scheduledDeparture
              ? new Date(
                  body.scheduledDeparture,
                )
              : null,

          scheduledArrival:
            body.scheduledArrival
              ? new Date(
                  body.scheduledArrival,
                )
              : null,

          aircraftType:
            body.aircraftType ||
            null,

          departureTerminal:
            body.departureTerminal ||
            null,

          arrivalTerminal:
            body.arrivalTerminal ||
            null,

          senderName:
            body.senderName,

          senderPhone:
            body.senderPhone,

          senderGSTIN:
            body.senderGSTIN ||
            null,

          senderPincode:
            body.senderPincode ||
            null,

          invoiceNumber:
            body.invoiceNumber
              ?.trim() ||
            null,

          invoiceValue:
            body.invoiceValue !==
                undefined &&
            body.invoiceValue !==
                null &&
            String(
              body.invoiceValue,
            ).trim() !== ""
              ? Number(
                  body.invoiceValue,
                )
              : null,

          senderState:
            body.senderState ||
            null,

          senderCity:
            body.senderCity ||
            null,

          senderAddress:
            body.senderAddress,

          receiverName:
            body.receiverName,

          receiverPhone:
            body.receiverPhone,

          receiverGSTIN:
            body.receiverGSTIN ||
            null,

          receiverPincode:
            body.receiverPincode ||
            null,

          receiverState:
            body.receiverState ||
            null,

          receiverCity:
            body.receiverCity ||
            null,

          receiverAddress:
            body.receiverAddress,

          packageCount:
            body.packageCount,

          actualWeight:
            body.actualWeight,

          volumetricWeight:
            body.volumetricWeight,

          chargeableWeight:
            body.chargeableWeight,

          contents:
            body.contents,

          freight:
            body.freight,

          gst:
            body.gst,

          total:
            body.total,

          paymentReference:
            body.paymentReference ||
            null,

          remarks:
            body.remarks ||
            null,

          packages: {
            create:
              body.packages.map(
                (pkg: any) => ({
                  length:
                    pkg.length,
                  width:
                    pkg.width,
                  height:
                    pkg.height,
                  weight:
                    Number(pkg.weight || 0),
                }),
              ),
          },
        },

        include: {
          packages: true,
        },
      });

    return NextResponse.json(
      updated,
    );
  } catch (error: any) {
    if (
      error?.message ===
      "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to update shipment.",
      },
      {
        status: 500,
      },
    );
  }
}
