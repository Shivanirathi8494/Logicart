-- CreateEnum
CREATE TYPE "ClientBillingType" AS ENUM ('PREPAID_WALLET', 'CREDIT_ACCOUNT', 'PAY_PER_BOOKING');

-- CreateEnum
CREATE TYPE "ClientWalletTransactionType" AS ENUM ('CREDIT', 'BOOKING_DEBIT', 'BOOKING_REFUND', 'ADMIN_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "ShipmentPricingSource" AS ENUM ('STANDARD_RATE', 'CLIENT_RATE_CARD');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "billingType" "ClientBillingType" NOT NULL DEFAULT 'PREPAID_WALLET';

-- CreateTable
CREATE TABLE "ClientRateContract" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveUntil" TIMESTAMP(3),
    "status" "MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientRateContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientRateRoute" (
    "id" TEXT NOT NULL,
    "rateContractId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "minimumFreight" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "awbCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "handlingCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pickupCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deliveryCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fuelSurchargePct" DECIMAL(7,3) NOT NULL DEFAULT 0,
    "gstPct" DECIMAL(7,3) NOT NULL DEFAULT 18,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientRateRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientRateSlab" (
    "id" TEXT NOT NULL,
    "rateRouteId" TEXT NOT NULL,
    "minWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION,
    "ratePerKg" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientRateSlab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientWallet" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientWalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "shipmentId" TEXT,
    "type" "ClientWalletTransactionType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "balanceBefore" DECIMAL(14,2) NOT NULL,
    "balanceAfter" DECIMAL(14,2) NOT NULL,
    "reference" TEXT,
    "remarks" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientWalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentPricingSnapshot" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "rateContractId" TEXT,
    "contractVersion" INTEGER,
    "pricingSource" "ShipmentPricingSource" NOT NULL,
    "serviceType" TEXT,
    "actualWeight" DOUBLE PRECISION NOT NULL,
    "volumetricWeight" DOUBLE PRECISION NOT NULL,
    "chargeableWeight" DOUBLE PRECISION NOT NULL,
    "ratePerKg" DECIMAL(12,2) NOT NULL,
    "freightAmount" DECIMAL(14,2) NOT NULL,
    "minimumFreight" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "awbCharge" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "handlingCharge" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "pickupCharge" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "deliveryCharge" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "fuelSurcharge" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "gstAmount" DECIMAL(14,2) NOT NULL,
    "totalAmount" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentPricingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientRateContract_clientId_effectiveFrom_idx" ON "ClientRateContract"("clientId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "ClientRateContract_clientId_status_idx" ON "ClientRateContract"("clientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClientRateContract_clientId_version_key" ON "ClientRateContract"("clientId", "version");

-- CreateIndex
CREATE INDEX "ClientRateRoute_rateContractId_idx" ON "ClientRateRoute"("rateContractId");

-- CreateIndex
CREATE INDEX "ClientRateRoute_origin_destination_serviceType_idx" ON "ClientRateRoute"("origin", "destination", "serviceType");

-- CreateIndex
CREATE INDEX "ClientRateSlab_rateRouteId_minWeight_idx" ON "ClientRateSlab"("rateRouteId", "minWeight");

-- CreateIndex
CREATE UNIQUE INDEX "ClientWallet_clientId_key" ON "ClientWallet"("clientId");

-- CreateIndex
CREATE INDEX "ClientWalletTransaction_walletId_createdAt_idx" ON "ClientWalletTransaction"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "ClientWalletTransaction_clientId_createdAt_idx" ON "ClientWalletTransaction"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "ClientWalletTransaction_shipmentId_idx" ON "ClientWalletTransaction"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentPricingSnapshot_shipmentId_key" ON "ShipmentPricingSnapshot"("shipmentId");

-- CreateIndex
CREATE INDEX "ShipmentPricingSnapshot_rateContractId_idx" ON "ShipmentPricingSnapshot"("rateContractId");

-- CreateIndex
CREATE INDEX "ShipmentPricingSnapshot_pricingSource_idx" ON "ShipmentPricingSnapshot"("pricingSource");

-- AddForeignKey
ALTER TABLE "ClientRateContract" ADD CONSTRAINT "ClientRateContract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRateRoute" ADD CONSTRAINT "ClientRateRoute_rateContractId_fkey" FOREIGN KEY ("rateContractId") REFERENCES "ClientRateContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRateSlab" ADD CONSTRAINT "ClientRateSlab_rateRouteId_fkey" FOREIGN KEY ("rateRouteId") REFERENCES "ClientRateRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientWallet" ADD CONSTRAINT "ClientWallet_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientWalletTransaction" ADD CONSTRAINT "ClientWalletTransaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientWalletTransaction" ADD CONSTRAINT "ClientWalletTransaction_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientWalletTransaction" ADD CONSTRAINT "ClientWalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "ClientWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentPricingSnapshot" ADD CONSTRAINT "ShipmentPricingSnapshot_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentPricingSnapshot" ADD CONSTRAINT "ShipmentPricingSnapshot_rateContractId_fkey" FOREIGN KEY ("rateContractId") REFERENCES "ClientRateContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
