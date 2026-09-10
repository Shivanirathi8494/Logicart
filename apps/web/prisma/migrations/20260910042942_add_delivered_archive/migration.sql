-- CreateEnum
CREATE TYPE "ArchiveStatus" AS ENUM ('CREATING', 'VERIFIED', 'FAILED');

-- CreateTable
CREATE TABLE "delivered_archives" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "shipmentCount" INTEGER NOT NULL DEFAULT 0,
    "archiveKey" TEXT,
    "fileName" TEXT,
    "fileSize" BIGINT,
    "checksum" TEXT,
    "status" "ArchiveStatus" NOT NULL DEFAULT 'CREATING',
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "delivered_archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivered_archive_shipments" (
    "id" TEXT NOT NULL,
    "archiveId" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivered_archive_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivered_archives_archiveKey_key" ON "delivered_archives"("archiveKey");

-- CreateIndex
CREATE INDEX "delivered_archives_status_idx" ON "delivered_archives"("status");

-- CreateIndex
CREATE INDEX "delivered_archives_periodStart_periodEnd_idx" ON "delivered_archives"("periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "delivered_archive_shipments_shipmentId_key" ON "delivered_archive_shipments"("shipmentId");

-- CreateIndex
CREATE INDEX "delivered_archive_shipments_archiveId_idx" ON "delivered_archive_shipments"("archiveId");

-- CreateIndex
CREATE INDEX "delivered_archive_shipments_trackingNumber_idx" ON "delivered_archive_shipments"("trackingNumber");

-- AddForeignKey
ALTER TABLE "delivered_archive_shipments" ADD CONSTRAINT "delivered_archive_shipments_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "delivered_archives"("id") ON DELETE CASCADE ON UPDATE CASCADE;
