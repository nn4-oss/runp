-- CreateTable
CREATE TABLE "Messages" (
    "key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expire" TIMESTAMP(3),

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("key")
);
