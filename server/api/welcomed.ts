import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.user.userId
  
  try {

    const user = await prisma.user.update({
      where: { id },
      data: { welcomed: true }
    })

    return { success: true, message: 'User Welcomed!', user }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})