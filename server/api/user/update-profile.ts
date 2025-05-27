import { prisma } from '~/server/utils/prisma'
import setCookies from '~/utils/setCookies'
import { userSelect } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const { data } = await readBody(event)
  const id = event.context.user.userId

  try {
    
    // update user
    const user = await prisma.user.update({
      data: data,
      where: { id },
      select: userSelect
    })
    
    setCookies(event, 'user', user)
    
    return { success: true, message: 'Profile Updated!', user }
    
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
})