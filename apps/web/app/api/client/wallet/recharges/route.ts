import { randomBytes } from "crypto";

import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

const MIN_RECHARGE_AMOUNT = 500;
const MAX_RECHARGE_AMOUNT = 20_00_000;

/*
 * TEMPORARY / DEVELOPMENT CONFIGURATION
 *
 * Replace with real company payment settings before
 * enabling bank transfers in production.
 *
 * These details are intentionally dummy.
 */
const DUMMY_BANK_DETAILS = {
  isTestConfiguration: true,
  accountName: "LOGICARTS PRIVATE LIMITED - TEST",
  bankName: "DEMO BANK",
  accountNumber: "000000000000",
  ifsc: "DEMO0000000",
  accountType: "CURRENT",
  supportedMethods: ["NEFT", "RTGS", "IMPS"],
};

function createRechargeReference(clientCode: string) {
  const timestamp = Date.now().toString(36).toUpperCase();

  const random = randomBytes(3).toString("hex").toUpperCase();

  const safeClientCode = clientCode
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 12);

  return `LCR-${safeClientCode}-${timestamp}-${random}`;
}

function serializeRecharge(recharge: {
  id: string;
  amount: { toString(): string };
  paymentMethod: string;
  status: string;
  referenceNumber: string | null;
  provider: string | null;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  bankReference: string | null;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date | null;
  failedAt: Date | null;
  cancelledAt: Date | null;
}) {
  return {
    id: recharge.id,
    amount: Number(recharge.amount),
    paymentMethod: recharge.paymentMethod,
    status: recharge.status,
    referenceNumber: recharge.referenceNumber,
    provider: recharge.provider,
    providerOrderId: recharge.providerOrderId,
    providerPaymentId: recharge.providerPaymentId,
    bankReference: recharge.bankReference,
    remarks: recharge.remarks,
    createdAt: recharge.createdAt,
    updatedAt: recharge.updatedAt,
    paidAt: recharge.paidAt,
    failedAt: recharge.failedAt,
    cancelledAt: recharge.cancelledAt,
  };
}

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

    const recharges = await prisma.clientWalletRecharge.findMany({
      where: {
        clientId: user.clientId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,

      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        status: true,
        referenceNumber: true,
        provider: true,
        providerOrderId: true,
        providerPaymentId: true,
        bankReference: true,
        remarks: true,
        createdAt: true,
        updatedAt: true,
        paidAt: true,
        failedAt: true,
        cancelledAt: true,
      },
    });

    return NextResponse.json({
      recharges: recharges.map(serializeRecharge),

      limits: {
        minimum: MIN_RECHARGE_AMOUNT,
        maximum: MAX_RECHARGE_AMOUNT,
      },
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (error?.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        {
          status: 403,
        },
      );
    }

    console.error("Unable to load wallet recharges:", error);

    return NextResponse.json(
      {
        error: "Unable to load wallet recharges.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();

    const amount = Number(body.amount);

    const paymentMethod = String(body.paymentMethod || "").trim();

    if (!Number.isFinite(amount)) {
      return NextResponse.json(
        {
          error: "Enter a valid recharge amount.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isInteger(amount)) {
      return NextResponse.json(
        {
          error: "Recharge amount must be in whole rupees.",
        },
        {
          status: 400,
        },
      );
    }

    if (amount < MIN_RECHARGE_AMOUNT || amount > MAX_RECHARGE_AMOUNT) {
      return NextResponse.json(
        {
          error: "Recharge amount must be between ₹500 and ₹20,00,000.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      paymentMethod !== "BANK_TRANSFER" &&
      paymentMethod !== "ONLINE_PAYMENT"
    ) {
      return NextResponse.json(
        {
          error: "Select a valid payment method.",
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
        status: true,

        wallet: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          error: "Client account was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (client.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "Client account is not active.",
        },
        {
          status: 403,
        },
      );
    }

    if (!client.wallet) {
      return NextResponse.json(
        {
          error: "Client wallet was not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * ONLINE_PAYMENT is architecturally supported,
     * but no payment gateway is connected yet.
     *
     * Do not create a fake gateway payment/order.
     */
    if (paymentMethod === "ONLINE_PAYMENT") {
      return NextResponse.json(
        {
          error: "Online payment is not enabled yet. Please use Bank Transfer.",
          code: "ONLINE_PAYMENT_NOT_CONFIGURED",
        },
        {
          status: 503,
        },
      );
    }

    let recharge = null;

    /*
     * referenceNumber has a unique DB constraint.
     * Collision is extremely unlikely, but retry a few
     * times instead of assuming uniqueness.
     */
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const referenceNumber = createRechargeReference(client.code);

      try {
        recharge = await prisma.clientWalletRecharge.create({
          data: {
            clientId: client.id,
            walletId: client.wallet.id,

            amount,

            paymentMethod: "BANK_TRANSFER",
            status: "PENDING",

            referenceNumber,

            provider: null,
            providerOrderId: null,
            providerPaymentId: null,

            remarks: "Awaiting bank transfer verification.",

            createdByUserId: user.id,
          },

          select: {
            id: true,
            amount: true,
            paymentMethod: true,
            status: true,
            referenceNumber: true,
            provider: true,
            providerOrderId: true,
            providerPaymentId: true,
            bankReference: true,
            remarks: true,
            createdAt: true,
            updatedAt: true,
            paidAt: true,
            failedAt: true,
            cancelledAt: true,
          },
        });

        break;
      } catch (error: any) {
        if (error?.code !== "P2002") {
          throw error;
        }
      }
    }

    if (!recharge) {
      return NextResponse.json(
        {
          error:
            "Unable to generate a unique recharge reference. Please try again.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * CRITICAL:
     *
     * Creating a recharge request NEVER changes:
     *
     * - ClientWallet.balance
     * - ClientWalletTransaction
     *
     * Wallet credit happens only after a future
     * verified payment/reconciliation step.
     */

    return NextResponse.json(
      {
        recharge: serializeRecharge(recharge),

        paymentInstructions: {
          method: "BANK_TRANSFER",

          warning: "TEST PAYMENT CONFIGURATION - DO NOT SEND REAL MONEY.",

          bank: DUMMY_BANK_DETAILS,

          instructions: [
            "Use the recharge reference as the bank payment reference.",
            "Wallet credit will occur only after payment verification.",
          ],
        },
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (error?.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        {
          status: 403,
        },
      );
    }

    console.error("Unable to create wallet recharge:", error);

    return NextResponse.json(
      {
        error: "Unable to create wallet recharge.",
      },
      {
        status: 500,
      },
    );
  }
}
