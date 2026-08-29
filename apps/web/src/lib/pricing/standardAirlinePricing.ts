import { Prisma, ShipmentPricingSource } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type StandardAirlinePricingRequest = {
  airlineId: string;
  origin: string;
  destination: string;
  chargeableWeight: number;
};

export type StandardAirlinePricingResult = {
  pricingSource: ShipmentPricingSource;

  airlineId: string;
  origin: string;
  destination: string;

  serviceType: string;

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

/*
 * Standard airline tariff pricing.
 *
 * This is the fallback used when a CLIENT does not
 * have a negotiated Logicarts rate for the selected
 * route.
 *
 * The selected airline's configured GCR tariff is
 * always the source of truth.
 */
export async function resolveStandardAirlinePricing(
  request: StandardAirlinePricingRequest,
  tx?: Prisma.TransactionClient,
): Promise<StandardAirlinePricingResult> {
  const db = tx ?? prisma;

  const airlineId = String(request.airlineId || "").trim();

  const origin = String(request.origin || "")
    .trim()
    .toUpperCase();

  const destination = String(request.destination || "")
    .trim()
    .toUpperCase();

  const chargeableWeight = Number(request.chargeableWeight);

  if (!airlineId) {
    throw new Error("Select an airline to calculate the standard rate.");
  }

  if (!origin || !destination) {
    throw new Error("Origin and destination are required.");
  }

  if (!Number.isFinite(chargeableWeight) || chargeableWeight <= 0) {
    throw new Error("Chargeable weight must be greater than zero.");
  }

  const tariff = await db.airCargoTariff.findUnique({
    where: {
      airlineId_origin_destination_cargoType: {
        airlineId,
        origin,
        destination,
        cargoType: "GCR",
      },
    },
  });

  if (!tariff || !tariff.active) {
    throw new Error(
      `Standard airline tariff is not configured for ${origin} → ${destination}.`,
    );
  }

  let ratePerKg: number;

  if (chargeableWeight >= 100) {
    ratePerKg = Number(tariff.rate100Plus);
  } else if (chargeableWeight >= 45) {
    ratePerKg = Number(tariff.rate45Plus);
  } else {
    ratePerKg = Number(tariff.normalRate);
  }

  const calculatedFreight = money(chargeableWeight * ratePerKg);

  const minimumFreight = money(Number(tariff.minimumCharge));

  const freightAmount = money(Math.max(minimumFreight, calculatedFreight));

  /*
   * Existing standard tariff only defines freight.
   *
   * GST continues to follow the existing booking
   * behavior: 18% on freight.
   *
   * Additional contracted-client charges are NOT
   * invented for standard-rate fallback.
   */
  const awbCharge = 0;
  const handlingCharge = 0;
  const pickupCharge = 0;
  const deliveryCharge = 0;

  const fuelSurchargePct = 0;
  const fuelSurcharge = 0;

  const subtotal = freightAmount;

  const gstPct = 18;

  const gstAmount = money(subtotal * (gstPct / 100));

  const totalAmount = money(subtotal + gstAmount);

  return {
    pricingSource: "STANDARD_RATE",

    airlineId,
    origin,
    destination,

    serviceType: "STANDARD",

    ratePerKg,
    calculatedFreight,
    minimumFreight,
    freightAmount,

    awbCharge,
    handlingCharge,
    pickupCharge,
    deliveryCharge,

    fuelSurchargePct,
    fuelSurcharge,

    subtotal,

    gstPct,
    gstAmount,

    totalAmount,
  };
}
