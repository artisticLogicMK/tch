/*
  Warnings:

  - You are about to drop the column `views` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "views";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "views";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "views";

-- CreateTable
CREATE TABLE "Views" (
    "id" SERIAL NOT NULL,
    "ip_fingerprint" TEXT NOT NULL,
    "threadId" INTEGER,
    "postId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
