import { prisma } from '~/server/utils/prisma'
import getUserIdentifier from '~/utils/identifier'
import { postPicInclude } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody(event)
  const username = query.user

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.POSTS_LIMIT)
  
  try {
    
    const postInclude = postPicInclude(body.userId)
    
    const user = await prisma.user.findFirst({
      where: { username }
    })
    
    if (!user) return { success: false, message: 'User not found!', notFound: true }

    // Threads
    let posts = await prisma.post.findMany({
      where: { userId: user.id, hidden: false },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: postInclude
    })
    
    // Count threads
    const postsCount = await prisma.post.count({
      where: { userId: user.id, hidden: false }
    })
    
    
    // Store views here
    const identifier = getUserIdentifier(event)
    
    if (identifier) {
      // Add views to posts and thread
      const viewData = (posts ?? []).map(post => ({
        postId: post.id,
        userId: post.user.id,
        identifier: String(identifier)
      }))
      
      const views = await prisma.views.createMany({
        data: viewData,
        skipDuplicates: true
      })
    }
    
    
    // Check if user is authenticated and attach their actions to threads
    if (body.userId) {
      const userId = body.userId
      const postIds = posts.map(post => post.id) || []
    
      const [userReactions, userBookmarks] = await prisma.$transaction([
        prisma.reaction.findMany({
          where: {
            userId: userId,
            postId: { in: postIds }
          }
        }),
        prisma.bookmark.findMany({
          where: {
            userId: userId,
            postId: { in: postIds }
          },
          select: { postId: true }
        })
      ])
    
      // Attach User Reactions & Bookmarked Status to Threads
      posts = posts.map(post => ({
        ...post,
        currentUserReaction: userReactions.find(reaction => reaction.postId === post.id) || null,
        bookmarked: userBookmarks.some(bookmark => bookmark.postId === post.id) // Boolean flag
      }))
    }
    
    // Calculate total pages based on the total threads count and limit per page
    const totalPosts = postsCount || 0
    const totalPages = Math.ceil(totalPosts / limit)
    

    return { success: true, message: 'Fetch Successful!', posts, user, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})