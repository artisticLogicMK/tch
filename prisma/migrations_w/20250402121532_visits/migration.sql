/*
  Warnings:

  - You are about to drop the column `time` on the `Reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_userId_fkey";

-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "time",
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Visitors" (
    "id" SERIAL NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
