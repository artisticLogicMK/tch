import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id, suspended, banned, warn_text, warnings } = await readBody(event)

  try {
    
    const threadFiles = await prisma.thread.findMany({
      where: { userId: id },
      include: {
        images: { select: { url: true } },
        docs: { select: { url: true } }
      }
    })
    
    // Flatten all image URLs into a single array
    const threadImgs = threadFiles.flatMap(thread =>
      thread.images.map(image => image.url)
    )
    
    // Flatten all image URLs into a single array
    const threadDocs = threadFiles.flatMap(thread =>
      thread.docs.map(doc => doc.url)
    )
    
    
    const postFiles = await prisma.post.findMany({
      where: { userId: id },
      include: {
        images: { select: { url: true } },
        docs: { select: { url: true } }
      }
    })
    
    // Flatten all image URLs into a single array
    const postImgs = postFiles.flatMap(post =>
      post.images.map(image => image.url)
    )
    
    // Flatten all image URLs into a single array
    const postDocs = postFiles.flatMap(post =>
      post.docs.map(doc => doc.url)
    )
    
    const allImages = threadImgs.concat(postImgs)
    const allDocs = threadDocs.concat(postDocs)
    
    
    for (const img of allImages) {
      try {
        await deleteFile(img, '/contents_imgs')
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    
    for (const doc of allDocs) {
      try {
        await deleteFile(doc, '/contents_docs')
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    
    await prisma.user.delete({
        where: { id }
    })
    
    return { success: true }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})