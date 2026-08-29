import type { Prisma } from "@prisma/client";

type SettlementTx = Prisma.TransactionClient;

type SettleWalletRechargeInput = {
  tx: SettlementTx;

  rechargeId: string;

  bankReference?: string | null;

  provider?: string | null;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;

  createdByUserId: string;
};

export async function settleWalletRecharge({
  tx,
  rechargeId,
  bankReference,
  provider,
  providerOrderId,
  providerPaymentId,
  createdByUserId,
}: SettleWalletRechargeInput) {
  const normalizedBankReference = bankReference?.trim().toUpperCase() || null;

  if (normalizedBankReference) {
    const duplicateBankReference = await tx.clientWalletRecharge.findFirst({
      where: {
        bankReferenceNormalized: normalizedBankReference,

        NOT: {
          id: rechargeId,
        },
      },

      select: {
        id: true,
        referenceNumber: true,
      },
    });

    if (duplicateBankReference) {
      throw new Error("DUPLICATE_BANK_REFERENCE");
    }
  }

  if (providerPaymentId) {
    const duplicateProviderPayment = await tx.clientWalletRecharge.findFirst({
      where: {
        providerPaymentId,

        NOT: {
          id: rechargeId,
        },
      },

      select: {
        id: true,
      },
    });

    if (duplicateProviderPayment) {
      throw new Error("DUPLICATE_PROVIDER_PAYMENT");
    }
  }

  /*
   * Claim the recharge atomically.
   *
   * Only one process may move PENDING -> PROCESSING.
   * This protects against:
   *
   * - double Admin clicks
   * - duplicate provider webhooks
   * - concurrent settlement attempts
   */
  const claimed = await tx.clientWalletRecharge.updateMany({
    where: {
      id: rechargeId,
      status: "PENDING",
    },

    data: {
      status: "PROCESSING",
    },
  });

  if (claimed.count !== 1) {
    const existing = await tx.clientWalletRecharge.findUnique({
      where: {
        id: rechargeId,
      },

      select: {
        status: true,
        walletTransactionId: true,
      },
    });

    if (!existing) {
      throw new Error("RECHARGE_NOT_FOUND");
    }

    if (existing.status === "SUCCESS") {
      throw new Error("ALREADY_SETTLED");
    }

    throw new Error(`INVALID_RECHARGE_STATUS:${existing.status}`);
  }

  const recharge = await tx.clientWalletRecharge.findUnique({
    where: {
      id: rechargeId,
    },

    select: {
      id: true,
      clientId: true,
      walletId: true,
      amount: true,
      referenceNumber: true,
      paymentMethod: true,
    },
  });

  if (!recharge) {
    throw new Error("RECHARGE_NOT_FOUND");
  }

  if (recharge.paymentMethod === "BANK_TRANSFER" && !normalizedBankReference) {
    throw new Error("BANK_REFERENCE_REQUIRED");
  }

  if (recharge.paymentMethod === "ONLINE_PAYMENT" && !providerPaymentId) {
    throw new Error("PROVIDER_PAYMENT_ID_REQUIRED");
  }

  const wallet = await tx.clientWallet.findUnique({
    where: {
      id: recharge.walletId,
    },

    select: {
      id: true,
      clientId: true,
      balance: true,
    },
  });

  if (!wallet) {
    throw new Error("WALLET_NOT_FOUND");
  }

  if (wallet.clientId !== recharge.clientId) {
    throw new Error("WALLET_CLIENT_MISMATCH");
  }

  const balanceBefore = wallet.balance;

  const updatedWallet = await tx.clientWallet.update({
    where: {
      id: wallet.id,
    },

    data: {
      balance: {
        increment: recharge.amount,
      },
    },

    select: {
      balance: true,
    },
  });

  const transaction = await tx.clientWalletTransaction.create({
    data: {
      walletId: wallet.id,
      clientId: recharge.clientId,

      type: "CREDIT",

      amount: recharge.amount,

      balanceBefore,
      balanceAfter: updatedWallet.balance,

      reference: recharge.referenceNumber ?? `RECHARGE-${recharge.id}`,

      remarks:
        recharge.paymentMethod === "BANK_TRANSFER"
          ? `Bank transfer verified. UTR: ${bankReference}`
          : `Online payment verified. Provider payment: ${providerPaymentId}`,

      createdByUserId,
    },

    select: {
      id: true,
    },
  });

  const settledRecharge = await tx.clientWalletRecharge.update({
    where: {
      id: recharge.id,
    },

    data: {
      status: "SUCCESS",

      bankReference: bankReference?.trim() || null,

      bankReferenceNormalized: normalizedBankReference,

      provider: provider ?? undefined,

      providerOrderId: providerOrderId ?? undefined,

      providerPaymentId: providerPaymentId ?? undefined,

      walletTransactionId: transaction.id,

      paidAt: new Date(),

      remarks:
        recharge.paymentMethod === "BANK_TRANSFER"
          ? `Bank transfer verified. Wallet transaction: ${transaction.id}`
          : `Online payment verified. Wallet transaction: ${transaction.id}`,
    },

    select: {
      id: true,
      amount: true,
      status: true,
      referenceNumber: true,
      bankReference: true,
      provider: true,
      providerOrderId: true,
      providerPaymentId: true,
      walletTransactionId: true,
      paidAt: true,
    },
  });

  return {
    recharge: {
      ...settledRecharge,
      amount: Number(settledRecharge.amount),
    },

    wallet: {
      balanceBefore: Number(balanceBefore),
      balanceAfter: Number(updatedWallet.balance),
    },

    walletTransactionId: transaction.id,
  };
}
