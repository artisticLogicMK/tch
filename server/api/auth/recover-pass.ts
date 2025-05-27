import { prisma } from '~/server/utils/prisma'
import { encrypt } from '~/utils/crypto'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const email = query.email

  try {
    let secret = null
    
    const user = await prisma.user.findUnique({ where: { email } })
   
   if (user) {
     if (!user.secret) return { success: false, message: "No password recovery set for this user!" }
     
     secret = {
       question: user.secret.question,
       answer: encrypt(user.secret.answer)
     }
     return { success: true, secret }
   }
   else {
     return { success: false, message: "User not found!" }
   }

  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})