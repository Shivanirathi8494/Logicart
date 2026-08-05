import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const [
      company,
      clients,
      delivered,
    ] = await Promise.all([

      prisma.companySettings.findFirst(),

      prisma.customer.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.shipment.count({
        where: {
          status: "DELIVERED",
        },
      }),

    ]);

    return NextResponse.json({

      companyName: company?.companyName,

      tagline: company?.tagline,

      phone: company?.phone,

      email: company?.email,

      website: company?.website,

      linkedin: company?.linkedin,

      facebook: company?.facebook,

      instagram: company?.instagram,

      youtube: company?.youtube,

      support: company?.supportText,

      clients,

      shipmentsDelivered: delivered,

      citiesConnected: company?.citiesConnected ?? 31,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to fetch dashboard statistics.",
      },
      {
        status: 500,
      },
    );

  }

}
