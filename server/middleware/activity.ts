import { prisma } from '~/server/utils/prisma'
import jwt from 'jsonwebtoken'
import { decrypt } from '~/utils/crypto'

const SECRET_KEY = process.env.JWT_KEY

export default defineEventHandler(async (event) => {
  try {
    
    // Get auth token cookie
    const token = getCookie(event, 'token')
    //event.context.userId = null
    
    // If token is set
    if (token) {
      const decryptToken = decrypt(token)
      const decoded = jwt.verify(decryptToken, SECRET_KEY)
      const user = decoded
      
      // Current Unix timestamp in seconds
      const now = Math.floor(Date.now() / 1000)
      
      const getUser = await prisma.user.findUnique({
        where: { id: user.userId }
      })
      
      // If user not found, remove cookie and redirect
      if (!getUser) {
        deleteCookie(event, 'token')
        deleteCookie(event, 'user')
        sendRedirect(event, '/', 302)
        return
      }
      
      const timeDiff = getUser.lastActivity ? now - getUser.lastActivity : 0
      const tenMinutesInSecs = 10 * 60 // 600 seconds
      
      // If user was inactive for more than 5 minutes, reset timeDiff to 0
      const activeTime = timeDiff > tenMinutesInSecs ? 5 * 60 : timeDiff
      
      // Add active time to total time spent online
      const timeOnline = (getUser.timeSpentOnline || 0) + activeTime
      
      await prisma.user.update({
        where: { id: user.userId },
        data: { lastActivity: now, timeSpentOnline: timeOnline }
      })
    }
    
  } catch (error) {
    console.error(error)
    //return { success: false, message: 'An error occured' }
  }
})