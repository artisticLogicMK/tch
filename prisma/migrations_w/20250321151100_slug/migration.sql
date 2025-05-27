-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '_';

-- AlterTable
ALTER TABLE "Forum" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '_';

-- CreateTable
CREATE TABLE "ForumFollowers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "forumId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumFollowers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollowers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollowers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ForumFollowers" ADD CONSTRAINT "ForumFollowers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumFollowers" ADD CONSTRAINT "ForumFollowers_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowers" ADD CONSTRAINT "UserFollowers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
