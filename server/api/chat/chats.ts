import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = body.userId
  const query = getQuery(event)
  const search = query.search
  const limit = Number(process.env.CHATS_LIMIT)
  
  try {
    
    const userSelect = {
      include: {
        moderating: true
      }
    }

    const baseWhere = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
      messages: {
        some: {}
      }
    }
    
    const searchWhere = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
      messages: {
        some: {}
      },
      AND: {
        OR: [
          { sender: { username: { contains: search, mode: 'insensitive' } } },
          { receiver: { username: { contains: search, mode: 'insensitive' } } },
          {
            messages: {
              some: {
                message: { contains: search, mode: 'insensitive' }
              }
            }
          }
        ]
      }
    }
    
    const isValidSearch = search && search.trim() !== '' && search !== 'null' && search !== 'undefined'
    const where = isValidSearch ? searchWhere : baseWhere
    
    const chats = await prisma.chat.findMany({
      where,
      orderBy: { lastUpdated: 'desc' },
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        sender: userSelect,
        receiver: userSelect,
        _count: {
          select: {
            messages: {
              where: { read: false, userId: { not: userId } }
            }
          }
        }
      }
    })
    
    const user = await prisma.user.findFirst({
      where: { id: userId },
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

    return { success: true, chats, user }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})