-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "quote" JSONB;

-- CreateTable
CREATE TABLE "Reports" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "reporter" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "link" TEXT NOT NULL,
    "threadId" INTEGER,
    "postId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
