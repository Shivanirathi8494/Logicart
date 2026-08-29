import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);

    const recharges = await prisma.clientWalletRecharge.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 200,

      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        status: true,
        referenceNumber: true,
        bankReference: true,
        remarks: true,
        createdAt: true,
        paidAt: true,

        client: {
          select: {
            id: true,
            code: true,
            companyName: true,
          },
        },

        wallet: {
          select: {
            balance: true,
          },
        },
      },
    });

    return NextResponse.json({
      recharges: recharges.map((recharge) => ({
        ...recharge,
        amount: Number(recharge.amount),

        wallet: {
          balance: Number(recharge.wallet.balance),
        },
      })),
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    console.error("Unable to load wallet recharge requests:", error);

    return NextResponse.json(
      {
        error: "Unable to load wallet recharge requests.",
      },
      {
        status: 500,
      },
    );
  }
}
