import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {

  try {

    const meta = await prisma.forumMeta.findFirst()
    
    return { success: true, message: 'Fetched!', meta }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})