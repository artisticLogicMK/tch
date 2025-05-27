import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { forumId, locked } = await readBody(event)

  try {
    
    const forum = await prisma.forum.update({
      where: { id: forumId },
      data:  { locked: !locked },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        forumAnnouncement: true
      }
    })
    
    return { success: true, message: `Forum ${forum.locked ? 'Locked' : 'Unlocked'}!`, forum }
    
  } catch (error) {
    if (error.code == 'P2002') return
    
    return { success: false, message: 'An error occured' }
  }
})