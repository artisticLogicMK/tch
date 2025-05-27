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
    
    const meta = await prisma.forumMeta.findFirst()
    
    // Fetch users timezone info from ipinfo here
    let timezone = "UTC"
    const token = process.env.VITE_IPINFO_TOKEN
    const url = `https://ipinfo.io?token=${token}`

    try {
      const response = await $fetch(url)
      timezone = response?.timezone ?? "UTC" // Set timezone to UTC if missing
    } catch (error) {
      console.error("Failed to fetch Geo info")
    }
    
    
    // Fetch Forum statistics here
    
    // Get 15 minutes time for lastActivity (unix)
    const now = Math.floor(Date.now() / 1000)
    const fifteenMins = 15 * 60

    const activeUsersCount = await prisma.user.count({
      where: { lastActivity: { gte: (now - fifteenMins) }  }
    })
    
    // Time threshold (15 minutes ago)
    const nowTime = new Date()
    const fifteenMinutesAgo = new Date(nowTime.getTime() - 15 * 60 * 1000)
    
    // Count visitors from the last 15 minutes
    const visitorsCount = await prisma.visitors.count({
      where: { lastVisit: { gte: fifteenMinutesAgo } },
    })
    
    // Get 10 online users
    const onlineUsers = await prisma.user.findMany({
      where: { lastActivity: { gte: (now - fifteenMins) }  },
      orderBy: [
        { threads: { _count: 'desc' } },
        { posts: { _count: 'desc' } },
        { views: { _count: 'desc' } },
      ],
      select: { username: true, country: true },
      take: 10,
    })
    
    const threadsCount = await prisma.thread.count()
    const postsCount = await prisma.post.count()
    const usersCount = await prisma.user.count()
    
    const newestUser = await prisma.user.findFirst({
      where: { username: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: { username: true, picture: true, createdAt: true, country: true }
    })

    // Get top forums
    const topForums = await prisma.forum.findMany({
      include: {
        category: { select: { slug: true } },
        _count: {
          select: {
            threads: true,
            posts: true,
          },
        },
      },
      orderBy: [
        { threads: { _count: 'desc' } },
        { posts: { _count: 'desc' } },
      ],
      take: 6, // Get only the top 4
    })

    const statistics = {
      activeUsersCount, visitorsCount, threadsCount, postsCount, usersCount, topForums, newestUser, onlineUsers
    }

    return {
      success: true, message: 'Fetch Successful!',
      global: {
        categories, meta, timezone, statistics
      }
    }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})