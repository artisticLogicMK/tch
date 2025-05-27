import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { chatId, userId, message } = await readBody(event)
  
  try {
  
    // Then create msg
    const newMsg = await prisma.message.create({
      data: { chatId, message, userId }
    })
    
    const moment = new Date().toISOString()
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastUpdated: moment, lastUser: userId }
    })
    
    return { success: true, newMsg }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})