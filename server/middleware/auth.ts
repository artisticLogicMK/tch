import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_KEY

// Define API routes that require authentication
const protectedRoutes = ['/api/auth/set-profile', '/api/auth/set-password', '/api/user/update-profile', '/api/user/update-picture', '/api/user/remove-picture', '/api/user/change-password', '/api/mod/set-category', '/api/mod/categories', '/api/mod/delete-category', '/api/mod/move-category', '/api/mod/set-forums', '/api/mod/forums', '/api/mod/delete-forum', '/api/mod/move-forum', '/api/mod/add-moderator', '/api/mod/moderators', '/api/mod/delete-moderator', '/api/mod/set-forumAnnounce', '/api/mod/lock-forum', '/api/mod/set-alerts', '/api/mod/alerts', '/api/welcomed', '/api/forum/set-thread', '/api/forum/set-reaction', '/api/forum/set-bookmarks', '/api/forum/thread', '/api/forum/remove-contents', '/api/forum/delete-thread', '/api/forum/mod-set', '/api/forum/set-post', '/api/forum/delete-post', '/api/forum/post', '/api/forum/report', '/api/mod/reports', '/api/mod/users', '/api/mod/mod-actions', '/api/chat/send-new', '/api/chat/send-msg', '/api/chat/messages', '/api/chat/del-msg', '/api/chat/chats', '/api/chat/fetch-msg', '/api/chat/checkChats']

export default defineEventHandler(async (event) => {
  const url = event.node.req.url

  // Only enforce authentication for protected API routes
  if (!protectedRoutes.includes(url)) {
    return // Allow all other requests (including pages)
  }

  // Check Authorization header
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, SECRET_KEY)
    event.context.user = decoded // Store user info in context
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
})