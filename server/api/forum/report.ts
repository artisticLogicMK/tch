import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { threadId, postId, userId, type, reporter, message, link } = await readBody(event)
  
  try {
    
    const reportee = {}
    if (threadId !== null) reportee.threadId = threadId
    if (postId !== null) reportee.postId = postId
    if (userId !== null) reportee.userId = userId
    
    const getReport = await prisma.reports.findFirst({
      where: { reporter, ...reportee }
    })
    
    if (!getReport) {
      await prisma.reports.create({
        data: { reporter, ...reportee, message, link, type }
      })
    }
  
    return { success: true, message: 'Reported!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})