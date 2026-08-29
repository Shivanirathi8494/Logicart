import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { settleWalletRecharge } from "@/lib/services/walletRecharge.service";

type RouteContext = {
  params: Promise<{
    rechargeId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireRole(["ADMIN"]);

    const { rechargeId } = await context.params;

    const body = await request.json();

    const bankReference = String(body.bankReference || "").trim();

    if (!bankReference) {
      return NextResponse.json(
        {
          error: "Bank UTR / transaction reference is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (bankReference.length < 4) {
      return NextResponse.json(
        {
          error: "Enter a valid bank UTR / transaction reference.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await prisma.$transaction(
      async (tx) =>
        settleWalletRecharge({
          tx,
          rechargeId,
          bankReference,
          createdByUserId: user.id,
        }),
      {
        maxWait: 10_000,
        timeout: 30_000,
      },
    );

    return NextResponse.json({
      success: true,

      message: "Payment verified and wallet credited successfully.",

      ...result,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        {
          status: 403,
        },
      );
    }

    if (message === "RECHARGE_NOT_FOUND") {
      return NextResponse.json(
        {
          error: "Recharge request was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (message === "ALREADY_SETTLED") {
      return NextResponse.json(
        {
          error: "This recharge has already been credited.",
        },
        {
          status: 409,
        },
      );
    }

    if (message.startsWith("INVALID_RECHARGE_STATUS:")) {
      const status = message.split(":")[1];

      return NextResponse.json(
        {
          error: `Recharge cannot be credited while its status is ${status}.`,
        },
        {
          status: 409,
        },
      );
    }

    if (message === "DUPLICATE_BANK_REFERENCE") {
      return NextResponse.json(
        {
          error:
            "This bank UTR / transaction reference has already been used for another recharge.",
        },
        {
          status: 409,
        },
      );
    }

    if (message === "BANK_REFERENCE_REQUIRED") {
      return NextResponse.json(
        {
          error: "Bank UTR / transaction reference is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      message === "WALLET_NOT_FOUND" ||
      message === "WALLET_CLIENT_MISMATCH"
    ) {
      return NextResponse.json(
        {
          error: "Wallet configuration is invalid for this recharge.",
        },
        {
          status: 409,
        },
      );
    }

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error: "This payment or wallet credit has already been recorded.",
        },
        {
          status: 409,
        },
      );
    }

    console.error("Unable to verify wallet recharge:", error);

    return NextResponse.json(
      {
        error: "Unable to verify payment and credit wallet.",
      },
      {
        status: 500,
      },
    );
  }
}
