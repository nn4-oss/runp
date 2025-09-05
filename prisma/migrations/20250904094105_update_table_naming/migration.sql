/*
  Warnings:

  - You are about to drop the `ServiceCredential` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ServiceCredential" DROP CONSTRAINT "ServiceCredential_credentialId_fkey";

-- DropTable
DROP TABLE "public"."ServiceCredential";

-- CreateTable
CREATE TABLE "public"."Integration" (
    "id" TEXT NOT NULL,
    "service" "public"."ThirdPartyServiceType" NOT NULL,
    "credentialId" TEXT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_integration_userId" ON "public"."Integration"("userId");

-- CreateIndex
CREATE INDEX "idx_integration_service" ON "public"."Integration"("service");

-- CreateIndex
CREATE INDEX "idx_integration_credentialId" ON "public"."Integration"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_service_userId_isPrimary_key" ON "public"."Integration"("service", "userId", "isPrimary");

-- AddForeignKey
ALTER TABLE "public"."Integration" ADD CONSTRAINT "Integration_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;
