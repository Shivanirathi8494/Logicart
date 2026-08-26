-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('AIRPORT_DELIVERY', 'DOOR_TO_DOOR');

-- AlterTable
ALTER TABLE "DeliveryChallan" ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL DEFAULT 'DOOR_TO_DOOR';

-- CreateIndex
CREATE INDEX "DeliveryChallan_deliveryType_idx" ON "DeliveryChallan"("deliveryType");
