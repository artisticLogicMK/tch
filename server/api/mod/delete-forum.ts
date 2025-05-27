import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { frmId } = await readBody(event)

  try {
    
    const forum = await prisma.forum.delete({
      where: { id: frmId }
    })
        
    return { success: true, message: 'Forum Deleted!', forum }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})