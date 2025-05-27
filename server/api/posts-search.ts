import { prisma } from '~/server/utils/prisma'
import getUserActions from '~/utils/query/getUserActions'
import getUserIdentifier from '~/utils/identifier'
import { threadPicInclude, postPicInclude, constructFiltersPosts } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody(event)

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.POSTS_LIMIT)
  
  try {
    
    const postInclude = postPicInclude(body.userId)
    const threadInclude = threadPicInclude(body.userId)
    
    const { where, orderByClause } = constructFiltersPosts(body.filters)
      
    let posts = await prisma.post.findMany({
      where: { hidden: false, ...where },
      orderBy: orderByClause,
      skip: (page - 1) * limit,
      take: limit,
      include: postInclude
    })
    
    const postsCount = await prisma.post.count({
      where: { hidden: false, ...where }
    })
    
    // Store views here
    const identifier = getUserIdentifier(event)
    
    if (identifier) {
      // Add views to posts
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
    
    
    if (body.userId) { // user is authenticated
      // Proceed attaching user actions on all returned posts
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
    
      // Attach User Reactions & Bookmarked Status to posts
      posts = posts.map(post => ({
        ...post,
        currentUserReaction: userReactions.find(reaction => reaction.postId === post.id) || null,
        bookmarked: userBookmarks.some(bookmark => bookmark.postId === post.id) // Boolean flag
      }))
    }
    
    // Calculate total pages based on the total posts count and limit per page
    const totalPosts = postsCount || 0
    const totalPages = Math.ceil(totalPosts / limit)

    return { success: true, message: 'Fetch Successful!', posts, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})