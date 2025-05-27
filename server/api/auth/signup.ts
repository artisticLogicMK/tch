import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { email, password, picture, googleAuth } = await readBody(event)

  try {
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, message: 'Email already registered! Go Login.' }
    }
    
    const userDefaultPrefs = {
      allowMessage: true,
      seeMyThreads: true,
      seeWhoFollowMe: true,
      seeWhoIfollow: true,
      allowFollow: true,
      hideMeFromFollowers: false,
      seeFollowedForums: true,
      seeDob: false,
      seeEmail: false,
      seeOnline: true,
      allowWhatsapp: false
    }
    
    if (googleAuth) {
      await prisma.user.create({
        data: { email, picture: picture || '/assets/pic_placeholder.jpg', googleAuth: true, preferences: userDefaultPrefs }
      })
      return { success: true, message: 'User registered!' }
    }
    
    // Hash password using bcryptjs
    const hashedPassword = bcrypt.hashSync(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, preferences: userDefaultPrefs },
    })
    
    return { success: true, message: 'User registered!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})