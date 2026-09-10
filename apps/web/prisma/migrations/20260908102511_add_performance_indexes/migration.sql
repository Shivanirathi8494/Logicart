-- CreateIndex
CREATE INDEX "ManifestShipment_shipmentId_idx" ON "ManifestShipment"("shipmentId");

-- CreateIndex
CREATE INDEX "Shipment_status_createdAt_idx" ON "Shipment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Shipment_origin_status_createdAt_idx" ON "Shipment"("origin", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Shipment_destination_status_createdAt_idx" ON "Shipment"("destination", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Shipment_clientId_createdAt_idx" ON "Shipment"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "Shipment_agentId_createdAt_idx" ON "Shipment"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "ShipmentPackage_shipmentId_idx" ON "ShipmentPackage"("shipmentId");
