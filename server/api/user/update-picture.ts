import { ServerFile } from "nuxt-file-storage"
import { prisma } from '~/server/utils/prisma'
import setCookies from '~/utils/setCookies'
import { userSelect } from '~/utils/query/utils'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const { previous } = await readBody(event)
  const { files } = await readBody<{ files: ServerFile[] }>(event)
  const userId = event.context.user.userId
  
  try {
    let fileName
   
    // Try deleting the old file if it exists
    try {
      await deleteFile(previous, '/pics')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    
    for ( const file of files ) {
      // Extract file extension
      const fileExtension = file.name.split('.').pop() // e.g., 'png', 'jpg'
      
      const name = randomUUID()
      
      // Construct the filename with extension
      fileName = `${name}.${fileExtension}`
      
      await storeFileLocally(file, name, '/pics')
    }

    // update user
    const user = await prisma.user.update({
      data: { picture: '/uploads/pics/'+fileName },
      where: { id: userId },
      select: userSelect
    })
    
    setCookies(event, 'user', user)
    
    return { success: true, message: 'Picture Updated!', user }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})