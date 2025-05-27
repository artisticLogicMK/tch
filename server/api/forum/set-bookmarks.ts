import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { data, userId, threadId, postId } = await readBody(event)
  
  try {

    let qry = { userId }
    if (threadId !== null) {
      qry.threadId = threadId
      qry.type = "thread"
    }
    
    if (postId !== null) {
      qry.postId = postId
      qry.type = "post"
    }

    const ifBookmarked = await prisma.bookmark.findFirst({ where: qry })
    if (ifBookmarked) {
      const del = await prisma.bookmark.deleteMany({ where: qry })
      return { success: true, bookmark: false }
    } else {
      const bk = await prisma.bookmark.create({ data: qry
      })
      return { success: true, bookmark: true }
    }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})