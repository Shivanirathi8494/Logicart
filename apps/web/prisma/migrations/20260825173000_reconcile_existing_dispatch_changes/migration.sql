-- These changes already exist in the database.
-- This migration records them in Prisma migration history.

ALTER TYPE "ShipmentStatus"
ADD VALUE IF NOT EXISTS 'OUT_FOR_DELIVERY';

DROP INDEX IF EXISTS
"DeliveryChallanShipment_challanId_shipmentId_key";

CREATE UNIQUE INDEX IF NOT EXISTS
"DeliveryChallanShipment_shipmentId_key"
ON "DeliveryChallanShipment"("shipmentId");
