-- CreateTable
CREATE TABLE "DeliveryAttempt" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "createdByUserId" TEXT,
    "outcome" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadingTallyPackage" (
    "id" TEXT NOT NULL,
    "loadingTallyId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "loaded" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoadingTallyPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeliveryAttempt_shipmentId_idx" ON "DeliveryAttempt"("shipmentId");

-- CreateIndex
CREATE INDEX "DeliveryAttempt_createdByUserId_idx" ON "DeliveryAttempt"("createdByUserId");

-- CreateIndex
CREATE INDEX "DeliveryAttempt_attemptedAt_idx" ON "DeliveryAttempt"("attemptedAt");

-- CreateIndex
CREATE INDEX "LoadingTallyPackage_packageId_idx" ON "LoadingTallyPackage"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "LoadingTallyPackage_loadingTallyId_packageId_key" ON "LoadingTallyPackage"("loadingTallyId", "packageId");

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAttempt" ADD CONSTRAINT "DeliveryAttempt_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingTallyPackage" ADD CONSTRAINT "LoadingTallyPackage_loadingTallyId_fkey" FOREIGN KEY ("loadingTallyId") REFERENCES "LoadingTally"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingTallyPackage" ADD CONSTRAINT "LoadingTallyPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ShipmentPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
