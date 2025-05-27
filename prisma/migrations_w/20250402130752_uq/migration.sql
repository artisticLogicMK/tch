/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint]` on the table `Visitors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Visitors_fingerprint_key" ON "Visitors"("fingerprint");
