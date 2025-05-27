import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { threadId, userId } = await readBody(event)
  
  try {
    const thread = await prisma.thread.findFirst({
      where: { id: threadId },
      include: { posts: true, images: true }
    })

    for (const img of thread.images) {
      const delImg = await prisma.contentImages.deleteMany({ where: { id: img.id } })
      
      if (delImg) {
        try {
          await deleteFile(img.url, '/contents_imgs')
        } catch (error) {
          if (error.code !== 'ENOENT') throw error
        }
      }
    }
    
    for (const post of thread.posts) {
      const getPost = await prisma.post.findFirst({
        where: { id: post.id },
        include: { images: true }
      })
      
      for (const img of getPost.images) {
        const delImg = await prisma.contentImages.deleteMany({ where: { id: img.id } })
        if (delImg) {
          try {
            await deleteFile(img.url, '/contents_imgs')
          } catch (error) {
            if (error.code !== 'ENOENT') throw error
          }
        }
      }
      
      await prisma.post.delete({ where: { id: post.id } })
    }
    
    // Delete thread
    await prisma.thread.delete({ where: { id: threadId } })
   
    return { success: true, message: 'Content Removed!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})