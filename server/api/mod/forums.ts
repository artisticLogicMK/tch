import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
  
    // Forums
    const forums = await prisma.forum.findMany({
      orderBy: {
        position: "asc",
      },
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

    return { success: true, message: 'Fetch Successful!', forums }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})