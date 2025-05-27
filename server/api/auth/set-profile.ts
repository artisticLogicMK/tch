import { PrismaClient } from '@prisma/client'
import setCookies from '~/utils/setCookies'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { data } = await readBody(event)
  const id = event.context.user.userId

  try {
    // Ensure username is not already taken
    const usernameTaken = await prisma.user.findUnique({ where: { username: data.username } })
    if (!data.editing && usernameTaken) {
      return { success: false, message: 'Username already taken!' }
    }
    
    delete data.editing
    
    // update user
    const user = await prisma.user.update({
      data: data,
      where: { id },
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
    
    setCookies(event, 'user', user)
    
    return { success: true, message: 'User Basic Info Set!', user }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})