import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { mode, welcome, announcement, hide, time } = await readBody(event)

  try {
    
    let meta
    let data
    
    if (mode === 'announcement') {
      data = { announcement, hide, time }
    } else {
      data = { welcome }
    }
    
    // Check if alert is set
    const exist = await prisma.forumMeta.findFirst()
    
    // Set category
    if (exist) {
      meta = await prisma.forumMeta.update({
        where: { id: exist.id },
        data: data
      })
    } else {
      meta = await prisma.forumMeta.create({ data: data })
    }
    
    return { success: true, message: 'Updated!', meta }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})