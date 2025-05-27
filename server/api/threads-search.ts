import { prisma } from '~/server/utils/prisma'
import { threadNoPicInclude, constructFiltersThreads } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody(event)

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.THREADS_LIMIT)
  
  try {
    
    const threadInclude = threadNoPicInclude(body.userId)
    
    const { where, orderByClause } = constructFiltersThreads(body.filters)
    
    // Forum
    let threads = await prisma.thread.findMany({
      where: { hidden: false, ...where },
      orderBy: orderByClause,
      skip: (page - 1) * limit,
      take: limit,
      include: threadInclude
    })
    
    let threadsCount = await prisma.thread.count({
      where: { hidden: false, ...where }
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
    
//console.error(threads)
    return { success: true, message: 'Fetch Successful!', threads, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})