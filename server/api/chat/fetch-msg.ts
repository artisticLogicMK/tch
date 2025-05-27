import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {

    const msgs = await prisma.message.findMany({
      where: { chatId: body.chatId, userId: body.otherUserId, createdAt: { gt: body.lastMsgTime } },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, msgs }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})