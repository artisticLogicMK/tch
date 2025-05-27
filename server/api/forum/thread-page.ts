import { prisma } from '~/server/utils/prisma'
import getUserActions from '~/utils/query/getUserActions'
import getUserIdentifier from '~/utils/identifier'
import { threadPicInclude, postPicInclude, constructFiltersPosts } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug
  const body = await readBody(event)

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.POSTS_LIMIT)
  
  try {
    
    const postInclude = postPicInclude(body.userId)
    const threadInclude = threadPicInclude(body.userId)
    
    const { where, orderByClause } = constructFiltersPosts(body.filters)
    
    console.log('Memory:', process.memoryUsage())
    
    // Forum
    let thread = await prisma.thread.findFirst({
      where: { slug },
      include: {
        posts: {
          where: { hidden: false, pinned: false, ...where, ...(body.post ? {id: Number(body.post)} : {}) },
          orderBy: orderByClause,
          skip: (page - 1) * limit,
          take: limit,
          include: postInclude
        },
        ...threadInclude
      }
    })
    
    // Select pinned post
    let pinnedPost = !thread ? null : await prisma.post.findFirst({
      where: { threadId: thread.id, pinned: true },
      include: postInclude
    })
    
    // Store views here
    const identifier = getUserIdentifier(event)
    
    if (identifier) {
      // Add views to posts and thread
      const viewData = (thread?.posts ?? []).map(post => ({
        postId: post.id,
        userId: post.user.id,
        identifier: String(identifier)
      })).concat(
        pinnedPost ? [{
          postId: pinnedPost.id,
          userId: pinnedPost.user.id,
          identifier: String(identifier)
        }] : []
      )
      .concat([{
        threadId: thread.id,
        userId: thread.user.id,
        identifier: String(identifier)
      }])
      
      const views = await prisma.views.createMany({
        data: viewData,
        skipDuplicates: true
      })
    }
    
    
    if (body.userId) { // user is authenticated
      // Attach user reactions/bookmars to thread
      const getThreadActions = await getUserActions(body.userId, {threadId: thread.id}, thread.id, "thread")
      thread = { ...thread, ...getThreadActions }
      
      if (pinnedPost) {
        // Attach user reactions/bookmars to pinned post
        const getPostActions = await getUserActions(body.userId, {postId: pinnedPost.id}, pinnedPost.id, "post")
        pinnedPost = { ...pinnedPost, ...getPostActions }
      }
      
      // Proceed attaching user actions on all returned posts
      const userId = body.userId
      const postIds = thread?.posts.map(post => post.id) || []
    
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
      thread.posts = thread.posts.map(post => ({
        ...post,
        currentUserReaction: userReactions.find(reaction => reaction.postId === post.id) || null,
        bookmarked: userBookmarks.some(bookmark => bookmark.postId === post.id) // Boolean flag
      }))
    }
    
    // Calculate total pages based on the total threads count and limit per page
    const totalPosts = thread?._count?.posts || 0
    const totalPages = Math.ceil(totalPosts / limit)

    return { success: true, message: 'Fetch Successful!', thread: { ...thread, pinnedPost }, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})