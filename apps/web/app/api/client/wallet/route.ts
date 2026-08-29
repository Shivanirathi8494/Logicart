import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/authorization";

export async function GET() {
  try {
    const user = await requireRole(["CLIENT"]);

    if (!user.clientId) {
      return NextResponse.json(
        {
          error: "Client account is not linked to a client.",
        },
        {
          status: 400,
        },
      );
    }

    const client = await prisma.client.findUnique({
      where: {
        id: user.clientId,
      },

      select: {
        id: true,
        code: true,
        companyName: true,
        billingType: true,
        status: true,

        wallet: {
          select: {
            balance: true,

            transactions: {
              orderBy: {
                createdAt: "desc",
              },

              take: 100,

              select: {
                id: true,
                type: true,
                amount: true,
                balanceBefore: true,
                balanceAfter: true,
                reference: true,
                remarks: true,
                createdAt: true,

                shipment: {
                  select: {
                    trackingNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          error: "Client not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      client: {
        id: client.id,
        code: client.code,
        companyName: client.companyName,
        billingType: client.billingType,
        status: client.status,
      },

      wallet: {
        balance: Number(client.wallet?.balance ?? 0),

        transactions:
          client.wallet?.transactions.map((transaction) => ({
            id: transaction.id,

            type: transaction.type,

            amount: Number(transaction.amount),

            balanceBefore: Number(transaction.balanceBefore),

            balanceAfter: Number(transaction.balanceAfter),

            reference: transaction.reference,

            remarks: transaction.remarks,

            trackingNumber: transaction.shipment?.trackingNumber ?? null,

            createdAt: transaction.createdAt,
          })) ?? [],
      },
    });
  } catch (error) {
    console.error("Unable to load client wallet:", error);

    return NextResponse.json(
      {
        error: "Unable to load wallet.",
      },
      {
        status: 500,
      },
    );
  }
}
