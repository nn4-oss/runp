/*
  Warnings:

  - You are about to drop the column `serviceId` on the `ServiceCredential` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[service,userId,isPrimary]` on the table `ServiceCredential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `service` to the `ServiceCredential` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ThirdPartyServiceType" AS ENUM ('OPENAI', 'ANTHROPIC', 'XAI', 'E2B', 'SLACK', 'DISCORD');

-- DropForeignKey
ALTER TABLE "public"."ServiceCredential" DROP CONSTRAINT "ServiceCredential_serviceId_fkey";

-- DropIndex
DROP INDEX "public"."ServiceCredential_serviceId_userId_isPrimary_key";

-- DropIndex
DROP INDEX "public"."idx_serviceCredential_serviceId";

-- AlterTable
ALTER TABLE "public"."ServiceCredential" DROP COLUMN "serviceId",
ADD COLUMN     "service" "public"."ThirdPartyServiceType" NOT NULL;

-- DropTable
DROP TABLE "public"."Service";

-- CreateIndex
CREATE INDEX "idx_credential_userId" ON "public"."Credential"("userId");

-- CreateIndex
CREATE INDEX "idx_serviceCredential_service" ON "public"."ServiceCredential"("service");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCredential_service_userId_isPrimary_key" ON "public"."ServiceCredential"("service", "userId", "isPrimary");
