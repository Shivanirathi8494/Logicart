-- CreateTable
CREATE TABLE "AirCargoTariff" (
    "id" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "cargoType" TEXT NOT NULL DEFAULT 'GCR',
    "minimumCharge" DOUBLE PRECISION NOT NULL,
    "normalRate" DOUBLE PRECISION NOT NULL,
    "rate45Plus" DOUBLE PRECISION NOT NULL,
    "rate100Plus" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AirCargoTariff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AirCargoTariff_airlineId_origin_destination_idx" ON "AirCargoTariff"("airlineId", "origin", "destination");

-- CreateIndex
CREATE UNIQUE INDEX "AirCargoTariff_airlineId_origin_destination_cargoType_key" ON "AirCargoTariff"("airlineId", "origin", "destination", "cargoType");

-- AddForeignKey
ALTER TABLE "AirCargoTariff" ADD CONSTRAINT "AirCargoTariff_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
