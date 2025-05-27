import { prisma } from '~/server/utils/prisma'
import { threadNoPicInclude } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody(event)
  const username = query.user

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.THREADS_LIMIT)
  
  try {
    
    const threadInclude = threadNoPicInclude(body.userId)
    
    const user = await prisma.user.findFirst({
      where: { username },
      include: {
        bookmarks: {
          where: { type: 'thread', threadId: {not:null} },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            thread: {
              where: { hidden: false },
              include: threadInclude
            },
          }
        },
        _count: { select: { bookmarks: true, } }
      }
    })
    
    if (!user) return { success: false, message: 'User not found!', notFound: true }
    
    let threads = user.bookmarks.map(bookmark => bookmark.thread)
    
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
    const totalThreads = user._count.bookmarks || 0
    const totalPages = Math.ceil(totalThreads / limit)
    

    return { success: true, message: 'Fetch Successful!', threads, user: { ...user, bookmarks: [] }, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})