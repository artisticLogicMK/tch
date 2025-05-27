import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.catId

  try {
  
    // Category
    const category = await prisma.category.findFirst({
      where: { slug: id },
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
            },
            threads: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              select: { slug:true, createdAt:true }
            },
            posts: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              select: { createdAt:true, thread: { select: { slug:true } } }
            },
            _count: {
              select: {
                threads: true,
                posts: true
              }
            }
          }
        }
      }
    })
    
    return { success: true, message: 'Fetch Successful!', category }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
});