import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { data, userId, threadId, postId } = await readBody(event)
  
  try {

    let qry = { userId }
    if (threadId !== null) qry.threadId = threadId
    if (postId !== null) qry.postId = postId
    
    if (!data.userReaction) {
      // Delete old reaction first
      const del = await prisma.reaction.deleteMany({ where: qry })
    }
    
    if (data.userReaction) {
      const userReactedBefore = await prisma.reaction.findFirst({ where: qry })
      if (userReactedBefore) {
        const react = await prisma.reaction.update({ where:{ id: userReactedBefore.id, ...qry },
          data: { emoji: data.userReaction, ...qry }
        })
      } else {
        const react = await prisma.reaction.create({ data: { emoji: data.userReaction, ...qry }
        })
      }
    }
    
    return { success: true, message: 'Reacted!' }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})