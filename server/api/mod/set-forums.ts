import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { data, frmId, isEdit } = await readBody(event)

  try {
    
    let forum
    
    const include = {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      forumAnnouncement: true
    }
    
    // Set category
    if (isEdit) {
      forum = await prisma.forum.update({
        where: { id: frmId },
        data: data,
        include
      })
    } else {
      forum = await prisma.forum.create({
        data: data,
        include
      })
    }
    
    return { success: true, message: `Forum ${frmId ? 'Edited' : 'Added'}!`, forum }
    
  } catch (error) {
    console.error(error)
    if (error.code == 'P2002') return
    
    return { success: false, message: 'An error occured' }
  }
})