import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { postId, userId } = await readBody(event)
  
  try {
    const post = await prisma.post.findFirst({
      where: { id: postId },
      include: { images: true }
    })
    
    for (const img of post.images) {
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
    
    return { success: true, message: 'Content Removed!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})