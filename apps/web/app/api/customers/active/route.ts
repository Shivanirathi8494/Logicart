import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/authorization";

export async function GET() {
  try {
    await requireUser();

    const customers = await prisma.customer.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        code: true,
        name: true,
        contactPerson: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        state: true,
        gstNumber: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(customers);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Unable to load customers." },
      { status: 500 },
    );
  }
}
