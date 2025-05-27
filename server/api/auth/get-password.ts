import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  try {
    
    // Genetate random string
    const random = randomUUID()
    
    // Password generation
    const password = random.split('-')[0]
    
    // Hash password using bcryptjs
    const hashedPassword = bcrypt.hashSync(password, 10)

    // Create user
    const user = await prisma.user.update({
      data: { password: hashedPassword },
      where: { email }
    })
    
    return { success: true, password }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})