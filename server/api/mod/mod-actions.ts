import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id, suspended, banned, warn_text, warnings } = await readBody(event)

  try {
    
    if (suspended) {
      await prisma.user.update({
        where: { id },
        data: { suspended }
      })
      return { success: true }
    }
    
    if (warn_text) {
      await prisma.user.update({
        where: { id },
        data: { warn_text, warnings }
      })
      return { success: true }
    }
    
    if (banned !== null || banned !== undefined) {
      await prisma.user.update({
        where: { id },
        data: { banned }
      })
      return { success: true }
    }
    
    return { success: true, message: 'Set!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})