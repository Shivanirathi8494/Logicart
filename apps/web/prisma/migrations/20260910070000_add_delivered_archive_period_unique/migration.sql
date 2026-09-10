-- Prevent two archive metadata rows from representing the same
-- Monday-to-Monday delivered shipment archive period.
CREATE UNIQUE INDEX
  "delivered_archives_delivered_archive_period_key"
ON "delivered_archives"("periodStart", "periodEnd");
