import { prisma } from '~/server/utils/prisma'
import setCookies from '~/utils/setCookies'
import { userSelect } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const { previous } = await readBody(event)
  const id = event.context.user.userId
  
  try {
   
    // Try deleting the old file if it exists
    try {
      await deleteFile(previous, '/pics')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    
    // update user
    const user = await prisma.user.update({
      data: { picture: '/assets/pic_placeholder.jpg' },
      where: { id },
      select: userSelect
    })
    
    setCookies(event, 'user', user)
    
    return { success: true, message: 'Picture Removed!', user }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})