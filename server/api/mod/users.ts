import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { filters } = await readBody(event)
  const query = getQuery(event)
  const page = parseInt(query.page) || 1
  const limit = Number(process.env.USERS_LIMIT)
  
  try {

    const { search, orderBy, sort, startsWith, showOnly, country } = filters
  
    // Build 'where' filter
    const where = {}
  
    if (search !== '') {
      where.username = {
        contains: search,
        //mode: 'insensitive'
      }
    }
  
    if (startsWith !== '') {
      where.username = {
        ...where.username,
        startsWith,
        //mode: 'insensitive'
      }
    }
    
    if (showOnly !== '') {
      if (showOnly === 'suspended') {
        const date = new Date().toISOString()
        where.suspended = { gt: date }
      }
      else if (showOnly === 'banned') {
        where.banned = true
      }
    }
    
    if (country !== '') {
      where.country = { equals: country }
    }
  
    // Build orderBy dynamically
    let orderByClause = {}
  
    switch (orderBy) {
      case 'joined':
        orderByClause = { createdAt: sort }
        break
      case 'lastVisit':
        orderByClause = { lastLoggedIn: sort }
        break
      case 'threads':
        orderByClause = { threads: { _count: sort } }
        break
      case 'posts':
        orderByClause = { posts: { _count: sort } }
        break
      case 'views':
        orderByClause = { views: { _count: sort } }
        break
      case 'warnings':
        orderByClause = { warnings: sort }
        break
      case 'reports':
        orderByClause = { reports: { _count: sort } }
        break
      case 'suspended':
        orderByClause = { suspended: sort }
        break
      case 'banned':
        orderByClause = { banned: sort }
        break
      default:
        orderByClause = { createdAt: 'desc' }
    }

    // reports
    const users = await prisma.user.findMany({
      where,
      orderBy: orderByClause,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        lastLoggedIn: true,
        country: true,
        suspended: true,
        banned: true,
        warnings: true,
        moderating: true,
        _count: {
          select: {
            threads: true,
            posts: true,
            views: true,
            reports: true
          }
        }
      }
    })
    
    const usersCount = await prisma.user.count()
    
    // Calculate total pages based on the total reports count and limit per page
    const totalUsers = usersCount || 0
    const totalPages = Math.ceil(totalUsers / limit)

    return { success: true, message: 'Fetch Successful!', users, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})