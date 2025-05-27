import { prisma } from '~/server/utils/prisma'
import setCookies from '~/utils/setCookies'
import bcrypt from 'bcryptjs'
import { userSelect } from '~/utils/query/utils'

export default defineEventHandler(async (event) => {
  const { password, newPassword } = await readBody(event)
  const userId = event.context.user.userId

  try {
    
    // Check pass validity
    const pass = await prisma.user.findUnique({ where: { id: userId } })
    const isValid = bcrypt.compareSync(password, pass.password)
    if (!isValid) {
      return { success: false, message: 'Current Password Incorrect!' }
    }
    
    // Hash password using bcryptjs
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    
    // Proceed to update password
    const user = await prisma.user.update({
      data: { password: hashedPassword },
      where: { id: userId },
      select: userSelect
    })
    
    return { success: true, message: 'Password Changed!', user }
    
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
})