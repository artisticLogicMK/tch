/*/ Import clients
import { prisma } from '~/server/utils/prisma';
import { PrismaClient as PrismaOldClient } from '@/prisma-old/generated';
import urlSlug from '@/lib/urlSlug';

const prismaOld = new PrismaOldClient();

function chunkArray(arr, size = 5000) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const forumIdMap = new Map();
const userIdMap = new Map();
const threadIdMap = new Map();

async function bulkCategories(oldCats) {
  const data = oldCats.map(cat => ({
    name: cat.name,
    description: cat.name,
    slug: urlSlug(cat.name),
    position: cat.fid,
  }));
  for (const batch of chunkArray(data)) {
    await prisma.category.createMany({ data: batch, skipDuplicates: true });
  }
}

async function bulkForums(oldForums) {
  for (const forum of oldForums) {
    try {
      const created = await prisma.forum.create({
        data: {
          name: forum.name,
          description: forum.description,
          slug: urlSlug(forum.name),
          position: forum.fid,
          category: { connect: { id: 1 } },
        },
      });
      forumIdMap.set(forum.fid, created.id);
    } catch (err) {
      console.warn(`Skipped forum ${forum.fid}: ${err.message}`);
    }
  }
}

async function bulkUsers(oldUsers) {
  const defaultPrefs = {
    allowMessage: true,
    seeMyThreads: true,
    seeWhoFollowMe: true,
    seeWhoIfollow: true,
    allowFollow: true,
    hideMeFromFollowers: false,
    seeFollowedForums: true,
    seeDob: false,
    seeEmail: false,
    seeOnline: true,
    allowWhatsapp: false,
  };

  for (const u of oldUsers) {
    if (!u.email || !u.username) continue;

    try {
      const user = await prisma.user.create({
        data: {
          email: u.email.toLowerCase(),
          username: u.username,
          createdAt: new Date(u.regdate * 1000),
          lastActivity: u.lastactive,
          timeSpentOnline: u.timeonline,
          lastLoggedIn: u.lastvisit,
          oldUser: true,
          googleAuth: u.email.includes('gmail.com'),
          preferences: defaultPrefs,
        },
      });
      userIdMap.set(u.uid, user.id);
    } catch (err) {
      console.warn(`Skipped user ${u.uid}: ${err.message}`);
    }
  }
}

async function bulkThreads(oldThreads) {
  for (const t of oldThreads) {
    const userId = userIdMap.get(t.uid);
    const forumId = forumIdMap.get(t.fid);
    if (!userId || !forumId) continue;

    try {
      const thread = await prisma.thread.create({
        data: {
          title: t.subject,
          slug: urlSlug(t.subject.slice(0, 50)),
          content_text: '',
          content_html: '',
          createdAt: new Date(t.dateline * 1000),
          updatedAt: new Date(t.dateline * 1000),
          user: { connect: { id: userId } },
          forum: { connect: { id: forumId } },
        },
      });
      threadIdMap.set(t.tid, thread.id);
    } catch (err) {
      console.warn(`Skipped thread ${t.tid}: ${err.message}`);
    }
  }
}

async function bulkPosts(oldPosts) {
  for (const p of oldPosts) {
    const userId = userIdMap.get(p.uid);
    const forumId = forumIdMap.get(p.fid);
    const threadId = threadIdMap.get(p.tid);
    if (!userId || !forumId || !threadId) continue;

    try {
      await prisma.post.create({
        data: {
          content_text: p.message,
          content_html: p.message,
          createdAt: new Date(p.dateline * 1000),
          updatedAt: new Date(p.dateline * 1000),
          user: { connect: { id: userId } },
          forum: { connect: { id: forumId } },
          thread: { connect: { id: threadId } },
        },
      });
    } catch (err) {
      console.warn(`Skipped post ${p.pid}: ${err.message}`);
    }
  }
}

export default defineEventHandler(async () => {
  try {
    const [oldCats, oldForums, oldUsers, oldThreads, oldPosts] = await Promise.all([
      prismaOld.mybb_forums.findMany({ where: { type: 'c' } }),
      prismaOld.mybb_forums.findMany({ where: { type: 'f' } }),
      prismaOld.mybb_users.findMany(),
      prismaOld.mybb_threads.findMany(),
      prismaOld.mybb_posts.findMany({ orderBy: { dateline: 'desc' } }),
    ]);

    await bulkCategories(oldCats);
    await bulkForums(oldForums);
    await bulkUsers(oldUsers);
    await bulkThreads(oldThreads);
    await bulkPosts(oldPosts);

    return { message: 'Migration completed successfully.' };
  } catch (err) {
    console.error('Migration error:', err);
    return { message: 'Migration failed', error: err.message };
  } finally {
    await prismaOld.$disconnect();
  }
});
*/