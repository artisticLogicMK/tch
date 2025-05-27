import { prisma } from '~/server/utils/prisma'
import { threadNoPicInclude } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const view = query.view
  const body = await readBody(event)

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.THREADS_LIMIT)
  
  try {
    
    const threadInclude = threadNoPicInclude(body.userId)
    
    const order = view === 'trend' ? {
      orderBy: [
        { posts: { _count: 'desc' } },
        { views: { _count: 'desc' } },
        { reactions: { _count: 'desc' } },
      ],
    } : {
      orderBy: { createdAt: 'desc' }
    }
    
    const oneMonthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)

    // Threads
    let threads = await prisma.thread.findMany({
      where: {
        hidden: false,
        createdAt: { gte: oneMonthAgo }
      },
      ...order,
      skip: (page - 1) * limit,
      take: limit,
      include: threadInclude
    })
    
    // Count threads
    const threadsCount = await prisma.thread.count({
      where: {
        hidden: false,
        createdAt: { gte: oneMonthAgo }
      }
    })
    
    // Check if user is authenticated and attach their actions to threads
    if (body.userId) {
      const userId = body.userId
      const threadIds = threads.map(thread => thread.id) || []
    
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
      threads = threads.map(thread => ({
        ...thread,
        currentUserReaction: userReactions.find(reaction => reaction.threadId === thread.id) || null,
        bookmarked: userBookmarks.some(bookmark => bookmark.threadId === thread.id) // Boolean flag
      }))
    }
    
    // Calculate total pages based on the total threads count and limit per page
    const totalThreads = threadsCount || 0
    const totalPages = Math.ceil(totalThreads / limit)
    

    return { success: true, message: 'Fetch Successful!', threads, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})