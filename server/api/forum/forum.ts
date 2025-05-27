import { prisma } from '~/server/utils/prisma'
import { threadNoPicInclude, constructFiltersThreads } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug
  const body = await readBody(event)

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.THREADS_LIMIT)
  
  try {
    
    const threadInclude = threadNoPicInclude(body.userId)
    
    const { where, orderByClause } = constructFiltersThreads(body.filters)
    
    console.log('Memory:', process.memoryUsage())
      
    // Forum
    const forum = await prisma.forum.findFirst({
      where: { slug },
      include: {
        category: true,
        moderators: {
          include: {
            user: {
              select: { username: true, id: true }
            }
          }
        },
        threads: {
          where: { hidden: false, pinned: false, ...where },
          orderBy: orderByClause,
          skip: (page - 1) * limit,
          take: limit,
          include: threadInclude
        },
        forumAnnouncement: true,
        _count: {
          select: {
            threads: true,
            posts: true
          }
        }
      }
    })
    
    // Make query to identify last thread and post
    const getLasts = await prisma.forum.findFirst({
      where: { slug },
      include: {
        threads: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { slug:true, createdAt:true }
        },
        posts: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { thread: { select: { slug:true } } }
        },
      }
    })
    
    const lasts = {
      threads: getLasts.threads,
      posts: getLasts.posts,
    }
    
    // Select pinned threads
    const pinnedThread = !forum ? null : await prisma.thread.findFirst({
      where: { forumId: forum.id, pinned: true },
      include: threadInclude
    })
    
    
    // Check if user is authenticated and attach their actions to threads
    if (body.userId) {
      const userId = body.userId
      const threadIds = forum?.threads.map(thread => thread.id) || []
    
      const [userReactions, userBookmarks] = await prisma.$transaction([
        prisma.reaction.findMany({
          where: {
            userId: userId,
            threadId: { in: threadIds }
          }
        }),
        prisma.bookmark.findMany({
          where: {
            userId: userId,
            threadId: { in: threadIds }
          },
          select: { threadId: true }
        })
      ])
    
      // Attach User Reactions & Bookmarked Status to Threads
      forum.threads = forum.threads.map(thread => ({
        ...thread,
        currentUserReaction: userReactions.find(reaction => reaction.threadId === thread.id) || null,
        bookmarked: userBookmarks.some(bookmark => bookmark.threadId === thread.id) // Boolean flag
      }))
    }
    
    // Calculate total pages based on the total threads count and limit per page
    const totalThreads = forum?._count?.threads || 0
    const totalPages = Math.ceil(totalThreads / limit)
    

    return { success: true, message: 'Fetch Successful!', forum: { ...forum, lasts, pinnedThread }, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})