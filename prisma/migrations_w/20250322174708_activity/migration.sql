/*
  Warnings:

  - The `lastActivity` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lastLoggedIn` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ForumMeta" ADD COLUMN     "auth" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastActivity",
ADD COLUMN     "lastActivity" INTEGER,
DROP COLUMN "lastLoggedIn",
ADD COLUMN     "lastLoggedIn" INTEGER;
