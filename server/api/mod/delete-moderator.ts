import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)

  try {
    
    const mod = await prisma.forumModerators.delete({
      where: { id }
    })
        
    return { success: true, message: 'Moderator Deleted!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})