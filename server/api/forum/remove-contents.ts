import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { data, type, threadId, postId, userId } = await readBody(event)
  
  try {
    
    if (type === "img") {
      await prisma.contentImages.deleteMany({
        where: { id: data.id }
      })
      try {
        await deleteFile(data.url, '/contents_imgs')
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    
    if (type === "doc") {
      const file = await prisma.contentDocs.deleteMany({
        where: { id: data.id }
      })
      try {
        await deleteFile(data.url, '/contents_docs')
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
   
    return { success: true, message: 'Content Removed!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})