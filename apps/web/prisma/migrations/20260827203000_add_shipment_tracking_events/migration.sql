-- CreateEnum
CREATE TYPE "ShipmentTrackingEventType" AS ENUM ('STATUS_CHANGE', 'DELIVERY_ATTEMPT');

-- CreateTable
CREATE TABLE "ShipmentTrackingEvent" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "eventType" "ShipmentTrackingEventType" NOT NULL DEFAULT 'STATUS_CHANGE',
    "locationCode" TEXT NOT NULL,
    "locationName" TEXT,
    "eventAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentTrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShipmentTrackingEvent_shipmentId_eventAt_idx" ON "ShipmentTrackingEvent"("shipmentId", "eventAt");

-- CreateIndex
CREATE INDEX "ShipmentTrackingEvent_status_idx" ON "ShipmentTrackingEvent"("status");

-- CreateIndex
CREATE INDEX "ShipmentTrackingEvent_locationCode_idx" ON "ShipmentTrackingEvent"("locationCode");

-- CreateIndex
CREATE INDEX "ShipmentTrackingEvent_createdByUserId_idx" ON "ShipmentTrackingEvent"("createdByUserId");

-- AddForeignKey
ALTER TABLE "ShipmentTrackingEvent" ADD CONSTRAINT "ShipmentTrackingEvent_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentTrackingEvent" ADD CONSTRAINT "ShipmentTrackingEvent_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
