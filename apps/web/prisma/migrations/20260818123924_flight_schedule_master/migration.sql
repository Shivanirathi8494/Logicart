-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "aircraftType" TEXT,
ADD COLUMN     "arrivalTerminal" TEXT,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "departureTerminal" TEXT,
ADD COLUMN     "scheduledArrival" TIMESTAMP(3),
ADD COLUMN     "scheduledDeparture" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FlightSchedule" (
    "id" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "scheduledDeparture" TIMESTAMP(3) NOT NULL,
    "scheduledArrival" TIMESTAMP(3) NOT NULL,
    "aircraftType" TEXT,
    "departureTerminal" TEXT,
    "arrivalTerminal" TEXT,
    "source" TEXT NOT NULL DEFAULT 'AERODATABOX',
    "externalId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlightSchedule_origin_destination_scheduledDeparture_idx" ON "FlightSchedule"("origin", "destination", "scheduledDeparture");

-- CreateIndex
CREATE INDEX "FlightSchedule_airlineId_idx" ON "FlightSchedule"("airlineId");

-- CreateIndex
CREATE INDEX "FlightSchedule_flightNumber_idx" ON "FlightSchedule"("flightNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FlightSchedule_flightNumber_origin_destination_scheduledDep_key" ON "FlightSchedule"("flightNumber", "origin", "destination", "scheduledDeparture");

-- CreateIndex
CREATE INDEX "Shipment_customerId_idx" ON "Shipment"("customerId");

-- AddForeignKey
ALTER TABLE "FlightSchedule" ADD CONSTRAINT "FlightSchedule_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
