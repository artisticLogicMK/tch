import { prisma } from '~/server/utils/prisma'

const getUserActions = async (userId, qry, id, type) => {
  try {
    
    const [userReactions, userBookmarks] = await prisma.$transaction([
      prisma.reaction.findMany({
        where: {
          userId: userId,
          ...qry
        }
      }),
      prisma.bookmark.findMany({
        where: {
          userId: userId,
          ...qry
        },
      })
    ])
      
    let result
    
    if (type === "post") {
      result = {
        currentUserReaction: userReactions.find(reaction => reaction.postId === id) || null,
        bookmarked: userBookmarks.some(bookmark => bookmark.postId === id) // Boolean flag
      }
    }
    
    if (type === "thread") {
      result = {
        currentUserReaction: userReactions.find(reaction => reaction.threadId === id) || null,
        bookmarked: userBookmarks.some(bookmark => bookmark.threadId === id) // Boolean flag
      }
    }
    
    return result
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
}

export default getUserActions