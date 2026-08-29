-- AlterTable
ALTER TABLE "ClientWalletRecharge" ADD COLUMN     "bankReferenceNormalized" TEXT,
ADD COLUMN     "walletTransactionId" TEXT;

-- CreateIndex

-- Backfill normalized bank references for already verified recharges.
UPDATE "ClientWalletRecharge"
SET "bankReferenceNormalized" = UPPER(TRIM("bankReference"))
WHERE "bankReference" IS NOT NULL;

CREATE UNIQUE INDEX "ClientWalletRecharge_bankReferenceNormalized_key" ON "ClientWalletRecharge"("bankReferenceNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "ClientWalletRecharge_walletTransactionId_key" ON "ClientWalletRecharge"("walletTransactionId");

-- AddForeignKey
ALTER TABLE "ClientWalletRecharge" ADD CONSTRAINT "ClientWalletRecharge_walletTransactionId_fkey" FOREIGN KEY ("walletTransactionId") REFERENCES "ClientWalletTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

