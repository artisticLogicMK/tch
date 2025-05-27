import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
  
    // Category
    const categories = await prisma.category.findMany({
      orderBy: {
        position: "asc",
      }
    })

    return { success: true, message: 'Fetch Successful!', categories }
    
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
})