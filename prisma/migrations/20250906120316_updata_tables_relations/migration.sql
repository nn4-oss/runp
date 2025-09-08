/*
  Warnings:

  - You are about to alter the column `userId` on the `Credential` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `userId` on the `Integration` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `userId` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "public"."Credential" DROP CONSTRAINT "Credential_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Integration" DROP CONSTRAINT "Integration_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Credential" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."Integration" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(255);

-- DropEnum
DROP TYPE "public"."UserRole";
