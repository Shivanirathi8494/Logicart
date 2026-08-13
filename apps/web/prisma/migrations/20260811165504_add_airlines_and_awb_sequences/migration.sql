-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "airlineId" TEXT;

-- CreateTable
CREATE TABLE "Airline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iataDesignator" TEXT NOT NULL,
    "icaoCode" TEXT NOT NULL,
    "iataPrefix" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AwbSequence" (
    "id" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "nextSerial" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AwbSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airline_name_key" ON "Airline"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_iataDesignator_key" ON "Airline"("iataDesignator");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_icaoCode_key" ON "Airline"("icaoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_iataPrefix_key" ON "Airline"("iataPrefix");

-- CreateIndex
CREATE UNIQUE INDEX "AwbSequence_airlineId_key" ON "AwbSequence"("airlineId");

-- AddForeignKey
ALTER TABLE "AwbSequence" ADD CONSTRAINT "AwbSequence_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE SET NULL ON UPDATE CASCADE;
