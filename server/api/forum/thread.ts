import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { userId, threadId } = await readBody(event)
  
  try {

    const isUserThread = await prisma.thread.findFirst({
      where: { userId, id: threadId },
    })
    
    const thread = await prisma.thread.findFirst({
      where: { id: threadId },
      include: {
        images: true,
        docs: true
      }
    })
    
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { moderating: true }
    })
    
    // Check if user is the owner of thread a admin/moderator of forum
    if (isUserThread || user.admin || user.moderating.some(m => m.forumId === thread.forumId)) {
      return { success: true, thread }
    } else {
      return { success: true, unAuthorized: true }
    }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})