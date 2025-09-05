/*
  Warnings:

  - You are about to alter the column `userId` on the `Credential` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `userId` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."Credential" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceCredential" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "public"."Service"("name");

-- CreateIndex
CREATE INDEX "idx_serviceCredential_userId" ON "public"."ServiceCredential"("userId");

-- CreateIndex
CREATE INDEX "idx_serviceCredential_serviceId" ON "public"."ServiceCredential"("serviceId");

-- CreateIndex
CREATE INDEX "idx_serviceCredential_credentialId" ON "public"."ServiceCredential"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCredential_serviceId_userId_isPrimary_key" ON "public"."ServiceCredential"("serviceId", "userId", "isPrimary");

-- CreateIndex
CREATE INDEX "idx_credential_userId" ON "public"."Credential"("userId");

-- CreateIndex
CREATE INDEX "idx_message_projectId" ON "public"."Message"("projectId");

-- CreateIndex
CREATE INDEX "idx_project_userId" ON "public"."Project"("userId");

-- AddForeignKey
ALTER TABLE "public"."ServiceCredential" ADD CONSTRAINT "ServiceCredential_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceCredential" ADD CONSTRAINT "ServiceCredential_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "public"."Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;
