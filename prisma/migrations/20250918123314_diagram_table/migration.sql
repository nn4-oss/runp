-- CreateTable
CREATE TABLE "public"."Diagram" (
    "id" TEXT NOT NULL,
    "fragmentId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diagram_fragmentId_key" ON "public"."Diagram"("fragmentId");

-- AddForeignKey
ALTER TABLE "public"."Diagram" ADD CONSTRAINT "Diagram_fragmentId_fkey" FOREIGN KEY ("fragmentId") REFERENCES "public"."Fragment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
