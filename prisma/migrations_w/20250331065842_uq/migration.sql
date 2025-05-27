/*
  Warnings:

  - You are about to drop the column `ip_fingerprint` on the `Views` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier,postId]` on the table `Views` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,threadId]` on the table `Views` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Views` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Views" DROP COLUMN "ip_fingerprint",
ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Views_identifier_postId_key" ON "Views"("identifier", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Views_identifier_threadId_key" ON "Views"("identifier", "threadId");
