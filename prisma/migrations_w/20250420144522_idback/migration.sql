-- AlterTable
CREATE SEQUENCE category_id_seq;
ALTER TABLE "Category" ALTER COLUMN "id" SET DEFAULT nextval('category_id_seq');
ALTER SEQUENCE category_id_seq OWNED BY "Category"."id";

-- AlterTable
CREATE SEQUENCE forum_id_seq;
ALTER TABLE "Forum" ALTER COLUMN "id" SET DEFAULT nextval('forum_id_seq');
ALTER SEQUENCE forum_id_seq OWNED BY "Forum"."id";

-- AlterTable
CREATE SEQUENCE post_id_seq;
ALTER TABLE "Post" ALTER COLUMN "id" SET DEFAULT nextval('post_id_seq');
ALTER SEQUENCE post_id_seq OWNED BY "Post"."id";

-- AlterTable
CREATE SEQUENCE thread_id_seq;
ALTER TABLE "Thread" ALTER COLUMN "id" SET DEFAULT nextval('thread_id_seq');
ALTER SEQUENCE thread_id_seq OWNED BY "Thread"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";
