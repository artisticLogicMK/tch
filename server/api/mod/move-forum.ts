import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { positions } = await readBody(event)
  const [ item1, item2 ] = positions
  
  try {
    
    await prisma.$transaction([
      prisma.forum.update({
        where: { id: item1.id },
        data: { position: item1.position }
      }),
      prisma.forum.update({
        where: { id: item2.id },
        data: { position: item2.position }
      })
    ])
    
    return { success: true, message: 'Forums Updated!'}
    
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
})