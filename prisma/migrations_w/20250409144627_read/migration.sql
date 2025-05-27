/*
  Warnings:

  - You are about to drop the column `read` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "read",
ADD COLUMN     "lastUpdated" TIMESTAMP(3),
ALTER COLUMN "favourite" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "read" BOOLEAN DEFAULT false;
