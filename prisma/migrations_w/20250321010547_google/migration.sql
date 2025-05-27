-- AlterTable
ALTER TABLE "ForumAnnouncement" ALTER COLUMN "hide" SET DEFAULT true;

-- AlterTable
ALTER TABLE "ForumMeta" ALTER COLUMN "hide" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastActivity" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastLoggedIn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timeSpentOnline" TEXT,
ADD COLUMN     "views" INTEGER,
ADD COLUMN     "welcomed" BOOLEAN NOT NULL DEFAULT false;
