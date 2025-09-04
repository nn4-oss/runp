/*
  Warnings:

  - The values [ANTHROPIC,XAI,SLACK,DISCORD] on the enum `ThirdPartyServiceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ThirdPartyServiceType_new" AS ENUM ('OPENAI', 'E2B');
ALTER TABLE "public"."Integration" ALTER COLUMN "service" TYPE "public"."ThirdPartyServiceType_new" USING ("service"::text::"public"."ThirdPartyServiceType_new");
ALTER TYPE "public"."ThirdPartyServiceType" RENAME TO "ThirdPartyServiceType_old";
ALTER TYPE "public"."ThirdPartyServiceType_new" RENAME TO "ThirdPartyServiceType";
DROP TYPE "public"."ThirdPartyServiceType_old";
COMMIT;
