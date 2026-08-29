-- AddForeignKey
ALTER TABLE "ClientWalletTransaction" ADD CONSTRAINT "ClientWalletTransaction_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
