-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "agentIataCode" TEXT,
ADD COLUMN     "commodityItemNumber" TEXT,
ADD COLUMN     "consigneeAccountNumber" TEXT,
ADD COLUMN     "declaredValueForCarriage" DOUBLE PRECISION,
ADD COLUMN     "declaredValueForCustoms" DOUBLE PRECISION,
ADD COLUMN     "insuranceAmount" DOUBLE PRECISION,
ADD COLUMN     "rateClass" TEXT,
ADD COLUMN     "shipperAccountNumber" TEXT,
ADD COLUMN     "specialCargoIndicator" TEXT;
