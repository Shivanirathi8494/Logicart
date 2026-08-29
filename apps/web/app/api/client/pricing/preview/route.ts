import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { resolveClientPricing } from "@/lib/pricing/clientPricing";
import { resolveStandardAirlinePricing } from "@/lib/pricing/standardAirlinePricing";

function numberValue(value: unknown) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(["CLIENT"]);

    if (!user.clientId) {
      return NextResponse.json(
        {
          error: "Your user account is not linked to a Client ID.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const packages = Array.isArray(body.packages) ? body.packages : [];

    /*
     * Recalculate weights on the server.
     * Never trust browser-computed pricing inputs.
     *
     * Existing Logicarts volumetric rule:
     * L × W × H / 6000
     */
    const actualWeight = packages.reduce(
      (total: number, pkg: any) => total + Math.max(0, numberValue(pkg.weight)),
      0,
    );

    const volumetricWeight = packages.reduce((total: number, pkg: any) => {
      const length = Math.max(0, numberValue(pkg.length));

      const width = Math.max(0, numberValue(pkg.width));

      const height = Math.max(0, numberValue(pkg.height));

      if (length <= 0 || width <= 0 || height <= 0) {
        return total;
      }

      return total + (length * width * height) / 6000;
    }, 0);

    const roundedActual = Number(actualWeight.toFixed(2));

    const roundedVolumetric = Number(volumetricWeight.toFixed(2));

    const chargeableWeight = Number(
      Math.max(roundedActual, roundedVolumetric).toFixed(2),
    );

    if (chargeableWeight <= 0) {
      return NextResponse.json(
        {
          error: "Shipment weight must be greater than zero.",
        },
        { status: 400 },
      );
    }

    /*
     * CLIENT service type resolution
     * --------------------------------
     *
     * Pricing is owned by the client's active
     * contracted route, not by a generic client
     * default.
     *
     * If the booking already supplies a service
     * type, use it.
     *
     * Otherwise discover the available service
     * type from the active rate contract for the
     * selected origin/destination.
     */
    const requestedOrigin = String(body.origin || "")
      .trim()
      .toUpperCase();

    const requestedDestination = String(body.destination || "")
      .trim()
      .toUpperCase();

    const requestedServiceType = String(body.serviceType || "")
      .trim()
      .toUpperCase();

    const client = await prisma.client.findUnique({
      where: {
        id: user.clientId,
      },

      select: {
        id: true,
        code: true,
        companyName: true,
        billingType: true,

        wallet: {
          select: {
            balance: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          error: "Client account was not found.",
        },
        { status: 404 },
      );
    }

    /*
     * PRICING SOURCE DECISION
     * -----------------------
     *
     * Always discover negotiated routes first.
     *
     * Never use browser serviceType to decide whether
     * a client contract exists. Standard-rate previews
     * may use "STANDARD" as descriptive pricing data,
     * but that must not force contracted pricing.
     */
    const now = new Date();

    const matchingRoutes = await prisma.clientRateRoute.findMany({
      where: {
        origin: requestedOrigin,
        destination: requestedDestination,

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

        rateContract: {
          select: {
            version: true,
            effectiveFrom: true,
          },
        },
      },

      orderBy: {
        rateContract: {
          version: "desc",
        },
      },
    });

    const serviceTypes = [
      ...new Set(
        matchingRoutes
          .map((route) =>
            String(route.serviceType || "")
              .trim()
              .toUpperCase(),
          )
          .filter(Boolean),
      ),
    ];

    /*
     * NO NEGOTIATED RATE
     * ------------------
     *
     * Fall back to the selected airline's active
     * backend GCR tariff.
     */
    if (serviceTypes.length === 0) {
      const airlineId = String(body.airlineId || "").trim();

      if (!airlineId) {
        return NextResponse.json({
          pricingPending: true,

          pricingSource: "STANDARD_RATE",

          message:
            "No contracted rate exists for this route. Select an airline to calculate the standard rate.",

          client: {
            id: client.id,
            code: client.code,
            companyName: client.companyName,
            billingType: client.billingType,
          },

          weights: {
            actualWeight: roundedActual,
            volumetricWeight: roundedVolumetric,
            chargeableWeight,
          },
        });
      }

      const standardPricing = await resolveStandardAirlinePricing({
        airlineId,

        origin: requestedOrigin,
        destination: requestedDestination,

        chargeableWeight,
      });

      const walletBalance = Number(client.wallet?.balance ?? 0);

      const walletAfter = Number(
        (walletBalance - standardPricing.totalAmount).toFixed(2),
      );

      const sufficientBalance =
        client.billingType !== "PREPAID_WALLET" || walletAfter >= 0;

      return NextResponse.json({
        pricingPending: false,

        client: {
          id: client.id,
          code: client.code,
          companyName: client.companyName,
          billingType: client.billingType,
        },

        weights: {
          actualWeight: roundedActual,
          volumetricWeight: roundedVolumetric,
          chargeableWeight,
        },

        pricing: {
          pricingSource: standardPricing.pricingSource,

          rateContractId: null,
          contractVersion: null,

          serviceType: standardPricing.serviceType,

          ratePerKg: standardPricing.ratePerKg,

          calculatedFreight: standardPricing.calculatedFreight,

          minimumFreight: standardPricing.minimumFreight,

          freightAmount: standardPricing.freightAmount,

          awbCharge: standardPricing.awbCharge,

          handlingCharge: standardPricing.handlingCharge,

          pickupCharge: standardPricing.pickupCharge,

          deliveryCharge: standardPricing.deliveryCharge,

          fuelSurcharge: standardPricing.fuelSurcharge,

          subtotal: standardPricing.subtotal,

          gstAmount: standardPricing.gstAmount,

          totalAmount: standardPricing.totalAmount,
        },

        wallet: {
          balance: walletBalance,

          afterBooking: walletAfter,

          sufficientBalance,
        },
      });
    }

    /*
     * NEGOTIATED RATE EXISTS
     * ----------------------
     *
     * Only now does serviceType matter.
     */
    let serviceType = requestedServiceType;

    /*
     * A previous standard-rate preview may have placed
     * STANDARD in client state. Do not accept a service
     * type that is not actually contracted.
     */
    if (serviceType && !serviceTypes.includes(serviceType)) {
      serviceType = "";
    }

    if (!serviceType) {
      if (serviceTypes.length > 1) {
        return NextResponse.json(
          {
            error: "Select a contracted service type for this route.",

            serviceTypes,
          },
          {
            status: 400,
          },
        );
      }

      serviceType = serviceTypes[0];
    }

    const pricing = await resolveClientPricing({
      clientId: user.clientId,

      origin: String(body.origin || ""),

      destination: String(body.destination || ""),

      serviceType,

      actualWeight: roundedActual,

      volumetricWeight: roundedVolumetric,

      chargeableWeight,
    });

    const walletBalance = Number(client.wallet?.balance ?? 0);

    const walletAfter = Number(
      (walletBalance - pricing.totalAmount).toFixed(2),
    );

    const sufficientBalance =
      client.billingType !== "PREPAID_WALLET" || walletAfter >= 0;

    return NextResponse.json({
      client: {
        id: client.id,
        code: client.code,
        companyName: client.companyName,
        billingType: client.billingType,
      },

      weights: {
        actualWeight: roundedActual,
        volumetricWeight: roundedVolumetric,
        chargeableWeight,
      },

      pricing: {
        pricingSource: pricing.pricingSource,

        rateContractId: pricing.rateContractId,

        contractVersion: pricing.contractVersion,

        serviceType: pricing.serviceType,

        ratePerKg: pricing.ratePerKg,

        calculatedFreight: pricing.calculatedFreight,

        minimumFreight: pricing.minimumFreight,

        freightAmount: pricing.freightAmount,

        awbCharge: pricing.awbCharge,

        handlingCharge: pricing.handlingCharge,

        pickupCharge: pricing.pickupCharge,

        deliveryCharge: pricing.deliveryCharge,

        fuelSurchargePct: pricing.fuelSurchargePct,

        fuelSurcharge: pricing.fuelSurcharge,

        subtotal: pricing.subtotal,

        gstPct: pricing.gstPct,

        gstAmount: pricing.gstAmount,

        totalAmount: pricing.totalAmount,
      },

      wallet: {
        balance: Number(walletBalance.toFixed(2)),

        afterBooking: walletAfter,

        sufficientBalance,
      },
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

    console.error("Client pricing preview failed:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unable to calculate client pricing.",
      },
      { status: 400 },
    );
  }
}
