-- CreateEnum
CREATE TYPE "ClientWalletRechargeMethod" AS ENUM ('BANK_TRANSFER', 'ONLINE_PAYMENT');

-- CreateEnum
CREATE TYPE "ClientWalletRechargeStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ClientWalletRecharge" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "paymentMethod" "ClientWalletRechargeMethod" NOT NULL,
    "status" "ClientWalletRechargeStatus" NOT NULL DEFAULT 'PENDING',
    "referenceNumber" TEXT,
    "provider" TEXT,
    "providerOrderId" TEXT,
    "providerPaymentId" TEXT,
    "bankReference" TEXT,
    "remarks" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "ClientWalletRecharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientWalletRecharge_referenceNumber_key" ON "ClientWalletRecharge"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClientWalletRecharge_providerOrderId_key" ON "ClientWalletRecharge"("providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientWalletRecharge_providerPaymentId_key" ON "ClientWalletRecharge"("providerPaymentId");

-- CreateIndex
CREATE INDEX "ClientWalletRecharge_clientId_createdAt_idx" ON "ClientWalletRecharge"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "ClientWalletRecharge_walletId_createdAt_idx" ON "ClientWalletRecharge"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "ClientWalletRecharge_status_idx" ON "ClientWalletRecharge"("status");

-- CreateIndex
CREATE INDEX "ClientWalletRecharge_paymentMethod_idx" ON "ClientWalletRecharge"("paymentMethod");

-- AddForeignKey
ALTER TABLE "ClientWalletRecharge" ADD CONSTRAINT "ClientWalletRecharge_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientWalletRecharge" ADD CONSTRAINT "ClientWalletRecharge_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "ClientWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

