import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug
  const body = await readBody(event)

  const page = parseInt(query.page) || 1
  const limit = Number(process.env.MESSAGES_LIMIT)
  
  try {
    
    const chat = await prisma.chat.findFirst({
      where: { slug },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        },
        sender: { select: { id: true, username: true, picture: true} },
        receiver: { select: { id: true, username: true, picture: true} },
        _count: {
          select: { messages: true }
        }
      }
    })
    
    // Update the messages of the other user to be read
    let otherUser
    if (chat.sender.id === body.userId) otherUser = chat.receiver
    if (chat.receiver.id === body.userId) otherUser = chat.sender
    
    // Sort messages to bring the recents down
    if (chat.messages?.length) {
      chat.messages = chat.messages.sort((a, b) => a.createdAt - b.createdAt)
    }
    
    await prisma.message.updateMany({
      where: { userId: otherUser.id, chatId: chat.id },
      data: { read: true }
    })
    
    const totalMsgs = chat?._count?.messages || 0
    const totalPages = Math.ceil(totalMsgs / limit)
    
    return { success: true, chat, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})