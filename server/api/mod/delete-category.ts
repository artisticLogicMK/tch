import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { catId } = await readBody(event)

  try {
    
    const category = await prisma.category.delete({
      where: { id: catId }
    })
        
    return { success: true, message: 'Category Deleted!', category }
    
  } catch (error) {
    return { success: false, message: 'An error occured' }
  }
})