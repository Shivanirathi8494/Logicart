import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type ClientPricingRequest = {
  clientId: string;
  origin: string;
  destination: string;
  serviceType: string;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  pricingDate?: Date;
};

export type ClientPricingResult = {
  pricingSource: "CLIENT_RATE_CARD";

  clientId: string;

  rateContractId: string;
  contractVersion: number;

  rateRouteId: string;
  rateSlabId: string;

  origin: string;
  destination: string;
  serviceType: string;

  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;

  ratePerKg: number;

  calculatedFreight: number;
  minimumFreight: number;
  freightAmount: number;

  awbCharge: number;
  handlingCharge: number;
  pickupCharge: number;
  deliveryCharge: number;

  fuelSurchargePct: number;
  fuelSurcharge: number;

  subtotal: number;

  gstPct: number;
  gstAmount: number;

  totalAmount: number;
};

function money(value: number) {
  return Number(value.toFixed(2));
}

function decimalToNumber(
  value: Prisma.Decimal | number | string | null | undefined,
) {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function requiredCode(value: string, label: string) {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

function requiredText(value: string, label: string) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

/**
 * Resolves the CLIENT'S negotiated selling price.
 *
 * IMPORTANT:
 * CLIENT pricing must never fall back to the
 * standard airline tariff.
 */
export async function resolveClientPricing(
  request: ClientPricingRequest,
  tx?: Prisma.TransactionClient,
): Promise<ClientPricingResult> {
  /*
   * Preview calls use the normal Prisma client.
   * Final booking calls pass the active transaction.
   */
  const db = tx ?? prisma;
  const clientId = String(request.clientId ?? "").trim();

  if (!clientId) {
    throw new Error("Client ID is required for client pricing.");
  }

  const origin = requiredCode(request.origin, "Origin");

  const destination = requiredCode(request.destination, "Destination");

  const serviceType = requiredText(request.serviceType, "Service type");

  const actualWeight = Number(request.actualWeight);
  const volumetricWeight = Number(request.volumetricWeight);
  const chargeableWeight = Number(request.chargeableWeight);

  if (!Number.isFinite(actualWeight) || actualWeight < 0) {
    throw new Error("Invalid actual weight.");
  }

  if (!Number.isFinite(volumetricWeight) || volumetricWeight < 0) {
    throw new Error("Invalid volumetric weight.");
  }

  if (!Number.isFinite(chargeableWeight) || chargeableWeight <= 0) {
    throw new Error("Chargeable weight must be greater than zero.");
  }

  /*
   * Do not trust a browser-supplied chargeable weight.
   * It must match the application's existing rule:
   *
   * max(actual weight, volumetric weight)
   */
  const expectedChargeableWeight = money(
    Math.max(actualWeight, volumetricWeight),
  );

  if (Math.abs(expectedChargeableWeight - money(chargeableWeight)) > 0.01) {
    throw new Error(
      "Chargeable weight does not match actual/volumetric weight.",
    );
  }

  const pricingDate = request.pricingDate ?? new Date();

  const client = await db.client.findFirst({
    where: {
      id: clientId,
      status: "ACTIVE",
    },

    select: {
      id: true,
      billingType: true,
    },
  });

  if (!client) {
    throw new Error("Active client account was not found.");
  }

  /*
   * A client may have historical and future
   * contracts. Select the newest version that
   * is effective for the booking timestamp.
   */
  const contract = await db.clientRateContract.findFirst({
    where: {
      clientId,
      status: "ACTIVE",

      effectiveFrom: {
        lte: pricingDate,
      },

      OR: [
        {
          effectiveUntil: null,
        },
        {
          effectiveUntil: {
            gte: pricingDate,
          },
        },
      ],
    },

    orderBy: [
      {
        effectiveFrom: "desc",
      },
      {
        version: "desc",
      },
    ],

    include: {
      routes: {
        where: {
          origin,
          destination,
          serviceType,
        },

        include: {
          slabs: {
            orderBy: {
              minWeight: "asc",
            },
          },
        },
      },
    },
  });

  if (!contract) {
    throw new Error(
      `No active client rate contract is configured for ${origin} → ${destination}.`,
    );
  }

  const route = contract.routes[0];

  if (!route) {
    throw new Error(
      `No contracted client rate is configured for ${origin} → ${destination} (${serviceType}).`,
    );
  }

  const slab = route.slabs.find((candidate) => {
    const minimum = Number(candidate.minWeight);

    const maximum =
      candidate.maxWeight === null ? null : Number(candidate.maxWeight);

    return (
      chargeableWeight >= minimum &&
      (maximum === null || chargeableWeight <= maximum)
    );
  });

  if (!slab) {
    throw new Error(
      `No client rate slab is configured for ${chargeableWeight.toFixed(
        2,
      )} Kg.`,
    );
  }

  const ratePerKg = decimalToNumber(slab.ratePerKg);

  const minimumFreight = decimalToNumber(route.minimumFreight);

  const awbCharge = decimalToNumber(route.awbCharge);

  const handlingCharge = decimalToNumber(route.handlingCharge);

  const pickupCharge = decimalToNumber(route.pickupCharge);

  const deliveryCharge = decimalToNumber(route.deliveryCharge);

  const fuelSurchargePct = decimalToNumber(route.fuelSurchargePct);

  const gstPct = decimalToNumber(route.gstPct);

  const calculatedFreight = money(chargeableWeight * ratePerKg);

  const freightAmount = money(Math.max(calculatedFreight, minimumFreight));

  const baseBeforeFuel = money(
    freightAmount + awbCharge + handlingCharge + pickupCharge + deliveryCharge,
  );

  const fuelSurcharge = money(baseBeforeFuel * (fuelSurchargePct / 100));

  const subtotal = money(baseBeforeFuel + fuelSurcharge);

  const gstAmount = money(subtotal * (gstPct / 100));

  const totalAmount = money(subtotal + gstAmount);

  return {
    pricingSource: "CLIENT_RATE_CARD",

    clientId,

    rateContractId: contract.id,
    contractVersion: contract.version,

    rateRouteId: route.id,
    rateSlabId: slab.id,

    origin,
    destination,
    serviceType,

    actualWeight: money(actualWeight),
    volumetricWeight: money(volumetricWeight),
    chargeableWeight: money(chargeableWeight),

    ratePerKg: money(ratePerKg),

    calculatedFreight,
    minimumFreight: money(minimumFreight),
    freightAmount,

    awbCharge: money(awbCharge),
    handlingCharge: money(handlingCharge),
    pickupCharge: money(pickupCharge),
    deliveryCharge: money(deliveryCharge),

    fuelSurchargePct,
    fuelSurcharge,

    subtotal,

    gstPct,
    gstAmount,

    totalAmount,
  };
}
