import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const airlineId =
    request.nextUrl.searchParams.get("airlineId");

  const origin =
    request.nextUrl.searchParams.get("origin");

  const destination =
    request.nextUrl.searchParams.get("destination");

  const chargeableWeight = Number(
    request.nextUrl.searchParams.get("chargeableWeight"),
  );

  if (
    !airlineId ||
    !origin ||
    !destination ||
    !Number.isFinite(chargeableWeight) ||
    chargeableWeight <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "Airline, origin, destination and chargeable weight are required.",
      },
      { status: 400 },
    );
  }

  const tariff = await prisma.airCargoTariff.findUnique({
    where: {
      airlineId_origin_destination_cargoType: {
        airlineId,
        origin: origin.trim().toUpperCase(),
        destination: destination.trim().toUpperCase(),
        cargoType: "GCR",
      },
    },
  });

  if (!tariff || !tariff.active) {
    return NextResponse.json(
      {
        error: `Alliance Air tariff is not configured for ${origin.toUpperCase()} → ${destination.toUpperCase()}.`,
      },
      { status: 404 },
    );
  }

  let rate: number;

  if (chargeableWeight >= 100) {
    rate = tariff.rate100Plus;
  } else if (chargeableWeight >= 45) {
    rate = tariff.rate45Plus;
  } else {
    rate = tariff.normalRate;
  }

  const calculated = chargeableWeight * rate;

  const freight = Math.max(
    tariff.minimumCharge,
    calculated,
  );

  return NextResponse.json({
    airlineId,
    origin: tariff.origin,
    destination: tariff.destination,
    cargoType: tariff.cargoType,
    chargeableWeight,
    rate,
    minimumCharge: tariff.minimumCharge,
    freight: Number(freight.toFixed(2)),
  });
}
