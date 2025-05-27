import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { encrypt } from '~/utils/crypto'
import { userSelect } from '~/utils/query/utils'

const SECRET_KEY = process.env.JWT_KEY

export default defineEventHandler(async (event) => {
  const { email, password, remember, picture, googleAuth } = await readBody(event)

  try {
    // Find user
    let user = await prisma.user.findUnique({ where: { email },
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
    
    if (!user) {
      return { success: false, message: googleAuth ? 'Uknown User!' : 'Invalid email or password.' }
    }
    
    // If user is suspended
    const today = new Date().toISOString()
    const suspended = new Date(user.suspended).toISOString()
    
    if (suspended > today) {
      return { success: true, suspended }
    }
    
    // If user is banned
    if (user.banned) {
      return { success: true, banned: true }
    }
    

    // non-Old and non-google users will login with password
    if (!user.oldUser && !googleAuth) {
      // Check password
      const isValid = bcrypt.compareSync(password, user.password)
      if (!isValid) {
        return { success: false, message: 'Invalid email or password.' }
      }
    }
    
    // Set google picture for old google auth users
    if (user.oldUser && googleAuth) {
      await prisma.user.update({
        where: { email },
        data: { picture: picture || '/assets/pic_placeholder.jpg' }
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '14d' })

    // Encrypt token and user data
    const encryptedToken = encrypt(token)
    const encryptedUser = encrypt(JSON.stringify(user))

    // Define cookie options
    const cookieOptions = {
      path: '/',
      ...(remember ? { maxAge: 60 * 60 * 24 * 14, // 14 days in seconds
        expires: new Date(Date.now() + 60 * 60 * 24 * 14 * 1000) // Explicit expiration date
      } : {}),
    }

    // Set cookies
    setCookie(event, 'token', encryptedToken, cookieOptions)
    setCookie(event, 'user', encryptedUser, cookieOptions)
    
    // Get timestamp
    const now = Math.floor(Date.now() / 1000)
    
    const admins = process.env.ADMINS.split(',')
    const isAdmin = admins.includes(user.username)
    
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoggedIn: now,
        ...(isAdmin ? { admin: true } : {}) // Spread conditionally
      }
    })
    
    return { success: true, message: 'Login successful!', user, token }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occurred.' }
  }
})