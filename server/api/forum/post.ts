import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { userId, postId } = await readBody(event)
  
  try {

    const isUserPost = await prisma.post.findFirst({
      where: { userId, id: postId },
    })
    
    const post = await prisma.post.findFirst({
      where: { id: postId },
      include: {
        images: true,
        docs: true
      }
    })
    
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { moderating: true }
    })
    
    // Check if user is the owner of post or a admin/moderator of forum
    if (isUserPost || user.admin || user.moderating.some(m => m.forumId === post.forumId)) {
      return { success: true, post }
    } else {
      return { success: true, unAuthorized: true }
    }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})