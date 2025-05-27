/*import { prisma } from '~/server/utils/prisma'
import { PrismaClient as PrismaOldClient } from '@/prisma-old/generated'

export const prismaOld = new PrismaOldClient()

export default defineEventHandler(async (event) => {

  try {
    await prisma.views.deleteMany()
    
    // Fetch old threads from the old DB
    const oldThreads = await prismaOld.mybb_threads.findMany()

    // Get valid thread IDs from the new DB
    const insertedThreadIds = await prisma.thread.findMany({
      select: { id: true },
    })
    const validThreadIds = new Set(insertedThreadIds.map(t => t.id))

    // Get valid user IDs from the new DB
    const insertedUserIds = await prisma.user.findMany({
      select: { id: true },
    })
    const validUserIds = new Set(insertedUserIds.map(u => u.id))

    // Prepare to insert views in batches
    const batchSize = 7000
    
    console.warn(`Started!`)
    for (const thread of oldThreads) {
      const views = thread.views || 0

      // Skip if the thread doesn't exist in the new DB
      if (!validThreadIds.has(thread.tid)) {
        console.warn(`Skipping views for missing thread ${thread.tid}`)
        continue
      }

      // Create view records with a fallback userId if missing or invalid
      const viewRecords = Array.from({ length: views }).map(() => ({
        threadId: thread.tid,
        userId: validUserIds.has(thread.uid) ? thread.uid : 1, // Use 1 (default) if userId is invalid
        identifier: "migration-Unique-identifier-for-threads", // generate unique identifier
      }))

      // Insert views in batches
      for (let i = 0; i < viewRecords.length; i += batchSize) {
        const batch = viewRecords.slice(i, i + batchSize)
        await prisma.views.createMany({ data: batch, skipDuplicates: true })
      }

      console.log(`Inserted ${views} views for thread ${thread.tid}`)
    }

    return { message: "Successful" }

  } catch (error) {
    console.error(error)
    return { message: error }
  }

})*/