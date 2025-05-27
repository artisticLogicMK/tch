import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { data, catId, isEdit } = await readBody(event)

  try {
    
    let category
    
    // Set category
    if (isEdit) {
      category = await prisma.category.update({
        where: { id: catId },
        data: data
      })
    } else {
      category = await prisma.category.create({ data: data })
    }
    
    return { success: true, message: `Category ${catId ? 'Edited' : 'Added'}!`, category }
    
  } catch (error) {
    console.error(error)
    if (error.code == 'P2002') return
    
    return { success: false, message: 'An error occured' }
  }
})