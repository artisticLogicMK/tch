import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page) || 1
  const limit = Number(process.env.REPORTS_LIMIT)
  
  try {

    // reports
    const reports = await prisma.reports.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })
    
    const reportsCount = await prisma.reports.count()
    
    // Calculate total pages based on the total reports count and limit per page
    const totalReports = reportsCount || 0
    const totalPages = Math.ceil(totalReports / limit)

    return { success: true, message: 'Fetch Successful!', reports, totalPages, currentPage: page }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})