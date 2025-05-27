import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { username, forumId } = await readBody(event)
  
  try {
    
    // Find user
    const user = await prisma.user.findUnique({ where: { username }
    })
    if (!user) {
      return { success: false, message: 'Username not found!' }
    }
    
    // Check if user already a moderator
    const isMod = await prisma.forumModerators.findFirst({
      where: { userId: user.id, forumId }
    })
    if (isMod) {
      return { success: false, message: 'Member is already a moderator on this forum!' }
    }
    
    const mod = await prisma.forumModerators.create({
      data: {
        userId: user.id,
        forumId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            picture: true
          }
        }
      }
    })
    
    return { success: true, message: 'Moderator Added', mod }
    
  } catch (error) {
    console.error(error)
    if (error.code == 'P2002') return
    return { success: false, message: 'An error occured' }
  }
})