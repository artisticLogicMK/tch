import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = body.userId
  
  try {

    const chatsCount = await prisma.chat.count({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
        lastUpdated: { gt: body.lastSeen },
        lastUser: { not: userId }
      }
    })

    if (chatsCount > 0) {
      return { success: true, newMsg: chatsCount }
    } else {
      return { success: true, newMsg: false }
    }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})