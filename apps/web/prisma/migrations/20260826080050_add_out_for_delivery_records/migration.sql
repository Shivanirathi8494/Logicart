-- CreateTable
CREATE TABLE "OutForDeliveryRecord" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,
    "remarks" TEXT,
    "dispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT,

    CONSTRAINT "OutForDeliveryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutForDeliveryRecord_shipmentId_idx" ON "OutForDeliveryRecord"("shipmentId");

-- CreateIndex
CREATE INDEX "OutForDeliveryRecord_vehicleNumber_idx" ON "OutForDeliveryRecord"("vehicleNumber");

-- CreateIndex
CREATE INDEX "OutForDeliveryRecord_dispatchedAt_idx" ON "OutForDeliveryRecord"("dispatchedAt");

-- AddForeignKey
ALTER TABLE "OutForDeliveryRecord" ADD CONSTRAINT "OutForDeliveryRecord_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutForDeliveryRecord" ADD CONSTRAINT "OutForDeliveryRecord_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
