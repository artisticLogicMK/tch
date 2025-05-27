import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { fingerprint } = body

  if (!fingerprint) {
    throw createError({ statusCode: 400, message: 'Fingerprint is required' })
  }

  // Current timestamp
  const now = new Date()

  // Update timestamp if fingerprint exists, otherwise create a new record
  await prisma.visitors.upsert({
    where: { fingerprint },
    update: { lastVisit: now },
    create: { fingerprint, lastVisit: now },
  })
  
  const maxAge = 60 * 60 * 24 * 365 * 10
  setCookie(event, "anon_id", fingerprint, {
    path: "/", 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "lax",
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
  })

  return { success: true }
})