/*
  Warnings:

  - Added the required column `lastVisit` to the `Visitors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Visitors" ADD COLUMN     "lastVisit" TIMESTAMP(3) NOT NULL;
