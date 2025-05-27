import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const { forumId } = await readBody(event)
  
    // Moderatotlrs
    const mods = await prisma.forumModerators.findMany({
      where: { forumId },
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

    return { success: true, message: 'Fetch Successful!', mods }
    
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
})