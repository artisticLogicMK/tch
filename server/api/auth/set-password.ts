import { PrismaClient } from '@prisma/client'
import setCookies from '~/utils/setCookies'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const id = event.context.user.userId

  try {
    
    // update user
    const user = await prisma.user.update({
      data: { password, oldUser: false },
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
    
    return { success: true, message: 'Password Set!', user}
    
  } catch (error) {
    console.log(error)
    return { success: false, message: 'An error occured' }
  }
})