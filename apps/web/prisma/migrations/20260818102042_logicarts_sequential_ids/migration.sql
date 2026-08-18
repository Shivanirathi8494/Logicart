-- CreateTable
CREATE TABLE "LogicartsSequence" (
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogicartsSequence_pkey" PRIMARY KEY ("key")
);
