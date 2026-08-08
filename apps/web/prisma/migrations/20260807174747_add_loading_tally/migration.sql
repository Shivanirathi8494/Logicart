-- CreateEnum
CREATE TYPE "LoadingTallyStatus" AS ENUM ('OPEN', 'COMPLETED');

-- AlterTable
ALTER TABLE "Manifest" ADD COLUMN     "loadingTallyId" TEXT;

-- CreateTable
CREATE TABLE "LoadingTally" (
    "id" TEXT NOT NULL,
    "loadingTallyNumber" TEXT NOT NULL,
    "loadingDate" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "status" "LoadingTallyStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoadingTally_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadingTallyShipment" (
    "id" TEXT NOT NULL,
    "loadingTallyId" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "manifestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoadingTallyShipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoadingTally_loadingTallyNumber_key" ON "LoadingTally"("loadingTallyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LoadingTallyShipment_loadingTallyId_shipmentId_key" ON "LoadingTallyShipment"("loadingTallyId", "shipmentId");

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_loadingTallyId_fkey" FOREIGN KEY ("loadingTallyId") REFERENCES "LoadingTally"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingTallyShipment" ADD CONSTRAINT "LoadingTallyShipment_loadingTallyId_fkey" FOREIGN KEY ("loadingTallyId") REFERENCES "LoadingTally"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingTallyShipment" ADD CONSTRAINT "LoadingTallyShipment_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingTallyShipment" ADD CONSTRAINT "LoadingTallyShipment_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
