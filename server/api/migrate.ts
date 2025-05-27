/*
// lib/clients.ts
import { prisma } from '~/server/utils/prisma'
import { PrismaClient as PrismaOldClient } from '@/prisma-old/generated'
import urlSlug from '@/lib/urlSlug'

export const prismaOld = new PrismaOldClient()

export default defineEventHandler(async (event) => {
  
  try {
    await prisma.post.deleteMany()
    await prisma.thread.deleteMany()
    await prisma.forum.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
    
    // Fetch old categories
    const oldcats = await prismaOld.mybb_forums.findMany({ where: { type: 'c'} })
    
    // Insert to new categories
    await prisma.category.createMany({
      data: oldcats.map((cat) => ({
        //id: cat.fid,
        name: cat.name,
        description: cat.name,
        slug: urlSlug(cat.name),
        position: cat.fid
      })),
      skipDuplicates: true,
    })
    
    // fetch forums from old db and insert in new
    const oldforums = await prismaOld.mybb_forums.findMany({ where: { type: 'f'} })
    
    // Insert to new forums
    await prisma.forum.createMany({
      data: oldforums.map((forum) => ({
        //id: forum.fid,
        name: forum.name,
        description: forum.description,
        slug: urlSlug(forum.name),
        position: forum.fid,
        categoryId: 1,
      })),
      skipDuplicates: true,
    })
    
  
  
  
  
    // Fetch and insert old users
    const oldUsers = await prismaOld.mybb_users.findMany()
    
    const userDefaultPrefs = { allowMessage: true, seeMyThreads: true, seeWhoFollowMe: true, seeWhoIfollow: true, allowFollow: true, hideMeFromFollowers: false, seeFollowedForums: true, seeDob: false, seeEmail: false, seeOnline: true, allowWhatsapp: false }
  
    const transformedUsers = oldUsers.map((u) => ({
      //id: u.uid,
      email: u.email?.toLowerCase(),
      username: u.username,
      createdAt: new Date(u.regdate * 1000).toISOString(),
      lastActivity: u.lastactive,
      timeSpentOnline: u.timeonline,
      lastLoggedIn: u.lastvisit,
      oldUser: true,
      googleAuth: u.email?.toLowerCase().includes("gmail.com"),
      preferences: userDefaultPrefs
    }))
  
    await prisma.user.createMany({
      data: transformedUsers,
      skipDuplicates: true,
    })
    console.log(`Inserted users!`)
    
    //const users = await prisma.user.findMany()
    
    
    
    
    
   /* const oldThreads = await prismaOld.mybb_threads.findMany({ orderBy: { dateline: 'desc' } })
  
    const userIdsInNewDb = new Set((await prisma.user.findMany({ select: { id: true } })).map(u => u.id))

  const threads = oldThreads
    .filter(t => userIdsInNewDb.has(t.uid)) // Only include threads where the user exists
    .map(t => ({
      id: t.tid,
      title: t.subject,
      userId: t.uid,
      forumId: t.fid,
      slug: urlSlug(t.subject.slice(0,50)),
      createdAt: new Date(t.dateline * 1000).toISOString(),
      content_html: '',
      content_text: ''
    }))
    
    await prisma.thread.createMany({
      data: threads,
      skipDuplicates: true,
    })
    console.log(`Inserted threads!`)
  
    
    
    
    
   
// Preload valid IDs to avoid foreign key violations
const validUserIds = new Set((await prisma.user.findMany({ select: { id: true } })).map(u => u.id))
const validThreadIds = new Set((await prisma.thread.findMany({ select: { id: true } })).map(t => t.id))
const validForumIds = new Set((await prisma.forum.findMany({ select: { id: true } })).map(f => f.id))

// Insert posts in batches
const batchSize = 5000
let offset = 0
let hasMore = true

while (hasMore) {
  const posts = await prismaOld.mybb_posts.findMany({
    skip: offset,
    take: batchSize,
    orderBy: { pid: 'asc' },
  })

  // Filter out posts with invalid references
  const validPosts = posts.filter(p =>
    validUserIds.has(p.uid) &&
    validThreadIds.has(p.tid) &&
    validForumIds.has(p.fid)
  )

  const mappedPosts = validPosts.map(p => ({
    id: p.pid,
    content_text: p.message,
    content_html: p.message,
    userId: p.uid,
    forumId: p.fid,
    threadId: p.tid,
    createdAt: new Date(p.dateline * 1000).toISOString(),
  }))

  if (mappedPosts.length > 0) {
    await prisma.post.createMany({
      data: mappedPosts,
      skipDuplicates: true,
    })
  }
  
  // Log dropped posts (optional)
  const dropped = posts.length - validPosts.length
  if (dropped > 0) {
    console.log(`Skipped ${dropped} posts due to invalid userId/threadId/forumId`)
  }

  offset += posts.length
  hasMore = posts.length === batchSize
}

console.log(`Inserted posts!`)
    
    /*
    const posts = await prismaOld.mybb_posts.findMany({
      orderBy: { pid: 'asc' },
    })
    
    const mappedPosts = posts.map(p => ({
      id: p.pid,
      content_text: p.message,
      content_html: p.message,
      userId: p.uid,
      forumId: p.fid,
      threadId: p.tid,
      createdAt: new Date(p.dateline * 1000).toISOString(),
    }))
  
    await prisma.post.createMany({
      data: mappedPosts,
      skipDuplicates: true,
    })
    
    const usersv = await prisma.user.findMany()
    const threadsv = await prisma.thread.findMany()
    const postsv = await prisma.post.findMany()
    
    
    //return { usersv, threadsv, postsv }
    return { message: "successfull" }
    
  } catch(error) {
    console.error(error)
    return { message: error }
  }
})*/