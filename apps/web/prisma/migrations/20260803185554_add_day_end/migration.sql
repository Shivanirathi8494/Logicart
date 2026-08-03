-- CreateEnum
CREATE TYPE "DayEndStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "DayEnd" (
    "id" TEXT NOT NULL,
    "businessDate" TIMESTAMP(3) NOT NULL,
    "branch" TEXT NOT NULL,
    "bookingCount" INTEGER NOT NULL,
    "manifestCount" INTEGER NOT NULL,
    "outscanCount" INTEGER NOT NULL,
    "deliveredCount" INTEGER NOT NULL,
    "pendingDelivery" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "cashCollection" DOUBLE PRECISION NOT NULL,
    "onlineCollection" DOUBLE PRECISION NOT NULL,
    "status" "DayEndStatus" NOT NULL DEFAULT 'OPEN',
    "closedBy" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DayEnd_pkey" PRIMARY KEY ("id")
);
