import { prisma } from '~/server/utils/prisma'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const { receiverId, senderId } = await readBody(event)
  
  try {
    
    const chatExist = await prisma.chat.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ]
      }
    })
    
    if (chatExist) {
      return { success: true, chatSlug: chatExist.slug }
    }
    
    const slug = randomUUID()
    
    // If chat does not exist
    const chat = await prisma.chat.create({
      data: { receiverId, senderId, slug }
    })

    return { success: true, chatSlug: chat.slug }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})