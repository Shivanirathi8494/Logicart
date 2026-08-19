-- CreateTable
CREATE TABLE "FlightScheduleSync" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "flightDate" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'AERODATABOX',
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightScheduleSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlightScheduleSync_origin_destination_idx" ON "FlightScheduleSync"("origin", "destination");

-- CreateIndex
CREATE INDEX "FlightScheduleSync_lastSyncedAt_idx" ON "FlightScheduleSync"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FlightScheduleSync_origin_destination_flightDate_key" ON "FlightScheduleSync"("origin", "destination", "flightDate");
