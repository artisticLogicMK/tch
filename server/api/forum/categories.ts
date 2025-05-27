import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
  
    // Category
    const categories = await prisma.category.findMany({
      orderBy: {
        position: "asc",
      },
      include: {
        forums: {
          orderBy: { position: "asc" },
          include: {
            category: true,
            moderators: {
              include: {
                user: {
                  select: { username: true }
                }
              }
            }
          }
        }
      }
    })

    return { success: true, message: 'Fetch Successful!', categories }
    
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
})