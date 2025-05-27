import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { data, threadId, postId } = await readBody(event)
  
  try {
    let result
    
    if (data.pinned === true && threadId !== null) {
      const getThread = await prisma.thread.findFirst({
        where: { id: threadId },
        include: { forum: true }
      })
      
      await prisma.thread.updateMany({
        where: { forumId: getThread.forum.id },
        data: { pinned: false }
      })
    }
    
    if (data.pinned === true && postId !== null) {
      const getPost = await prisma.post.findFirst({
        where: { id: postId },
        include: { thread: true }
      })
      
      await prisma.post.updateMany({
        where: { threadId: getPost.thread.id },
        data: { pinned: false }
      })
    }
    
    if (threadId !== null) {
      result = await prisma.thread.update({
        where: { id: threadId },
        data: data
      })
    }
    
    if (postId !== null) {
      result = await prisma.post.update({
        where: { id: postId },
        data: data
      }) 
    }
    
    return { success: true, message: 'Set!', result }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})