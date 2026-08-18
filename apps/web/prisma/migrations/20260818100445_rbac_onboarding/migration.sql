-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('COURIER_COMPANY', 'LOGISTICS_COMPANY', 'AGGREGATOR');

-- CreateEnum
CREATE TYPE "OnboardingType" AS ENUM ('CLIENT', 'AGENT');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'CLIENT';
ALTER TYPE "UserRole" ADD VALUE 'AGENT';
ALTER TYPE "UserRole" ADD VALUE 'EMPLOYEE';

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "createdByUserId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "clientId" TEXT;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "gstNumber" TEXT,
    "contactPerson" TEXT,
    "designation" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "serviceType" TEXT,
    "shipmentFrequency" TEXT,
    "status" "MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "agentType" "AgentType" NOT NULL,
    "gstNumber" TEXT,
    "contactPerson" TEXT,
    "designation" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "airport" TEXT,
    "destination" TEXT,
    "serviceType" TEXT,
    "shipmentFrequency" TEXT,
    "status" "MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeCode" TEXT,
    "city" TEXT,
    "airport" TEXT,
    "destination" TEXT,
    "status" "MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "type" "OnboardingType" NOT NULL,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'PENDING',
    "details" JSONB NOT NULL,
    "financeStatus" "ApprovalDecision" NOT NULL DEFAULT 'PENDING',
    "mdStatus" "ApprovalDecision" NOT NULL DEFAULT 'PENDING',
    "financeToken" TEXT NOT NULL,
    "mdToken" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_code_key" ON "Client"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_code_key" ON "Agent"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_userId_key" ON "EmployeeProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_employeeCode_key" ON "EmployeeProfile"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingRequest_requestNumber_key" ON "OnboardingRequest"("requestNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingRequest_financeToken_key" ON "OnboardingRequest"("financeToken");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingRequest_mdToken_key" ON "OnboardingRequest"("mdToken");

-- CreateIndex
CREATE INDEX "OnboardingRequest_status_idx" ON "OnboardingRequest"("status");

-- CreateIndex
CREATE INDEX "OnboardingRequest_type_idx" ON "OnboardingRequest"("type");

-- CreateIndex
CREATE INDEX "Shipment_clientId_idx" ON "Shipment"("clientId");

-- CreateIndex
CREATE INDEX "Shipment_agentId_idx" ON "Shipment"("agentId");

-- CreateIndex
CREATE INDEX "Shipment_createdByUserId_idx" ON "Shipment"("createdByUserId");

-- CreateIndex
CREATE INDEX "User_clientId_idx" ON "User"("clientId");

-- CreateIndex
CREATE INDEX "User_agentId_idx" ON "User"("agentId");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingRequest" ADD CONSTRAINT "OnboardingRequest_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
