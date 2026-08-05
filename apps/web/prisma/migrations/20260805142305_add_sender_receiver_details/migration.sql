-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "receiverCity" TEXT,
ADD COLUMN     "receiverGSTIN" TEXT,
ADD COLUMN     "receiverPincode" TEXT,
ADD COLUMN     "receiverState" TEXT,
ADD COLUMN     "senderCity" TEXT,
ADD COLUMN     "senderGSTIN" TEXT,
ADD COLUMN     "senderPincode" TEXT,
ADD COLUMN     "senderState" TEXT;
