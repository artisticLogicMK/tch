import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const username = query.user
  
  try {
    
    const user = await prisma.user.findFirst({
      where: { username },
      include: {
        moderating: {
          include: {
            forum: {
              select: {
                name: true, slug: true,
                category: { select: { name: true, slug: true } }
              }
            }
          }
        },
        _count: {
          select: {
            threads: true,
            posts: true,
            views: true,
          }
        }
      }
    })
    
    if (user) {
      return { success: true, message: 'User Fetched!', user }
    }
    else {
      return { success: false, message: 'User not found!', notFound: true }
    }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})