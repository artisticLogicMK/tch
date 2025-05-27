-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Forum" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Forum_id_seq";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Post_id_seq";

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Thread_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secret" JSONB,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "User_id_seq";
