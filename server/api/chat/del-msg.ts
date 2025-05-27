import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  
  try {
  
    await prisma.message.delete({ where: { id } })
    
    return { success: true }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})