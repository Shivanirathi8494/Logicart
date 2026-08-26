-- CreateTable
CREATE TABLE "ManifestUnloadPackage" (
    "id" TEXT NOT NULL,
    "manifestId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "unloaded" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManifestUnloadPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ManifestUnloadPackage_packageId_idx" ON "ManifestUnloadPackage"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "ManifestUnloadPackage_manifestId_packageId_key" ON "ManifestUnloadPackage"("manifestId", "packageId");

-- AddForeignKey
ALTER TABLE "ManifestUnloadPackage" ADD CONSTRAINT "ManifestUnloadPackage_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManifestUnloadPackage" ADD CONSTRAINT "ManifestUnloadPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ShipmentPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
