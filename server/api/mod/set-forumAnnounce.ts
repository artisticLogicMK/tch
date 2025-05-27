import { ServerFile } from "nuxt-file-storage"
import { prisma } from '~/server/utils/prisma'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const { data, forumId } = await readBody(event)
  const { files } = await readBody<{ files: ServerFile[] }>(event)
  
  try {
    
    // Check if announce is set
    const isSet = await prisma.forumAnnouncement.findFirst({ where: { forumId }
    })

    // Try deleting the old file if it exists
    if (isSet && isSet.audio && files.length) {
      try {
        await deleteFile(isSet.audio.split('/').pop(), '/announcements')
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    
    let fileName = null
    
    for ( const file of files ) {
      // Extract file extension
      const fileExtension = file.name.split('.').pop()
      
      const name = randomUUID()
      
      // Construct the filename with extension
      fileName = `${name}.${fileExtension}`
      
      await storeFileLocally(file, name, '/announcements')
    }
    
    
    let announce
    const audio = fileName ? { audio: '/uploads/announcements/'+fileName } : {}

    if (!isSet) {
      announce = await prisma.forumAnnouncement.create({
        data: { ...data, ...audio, forumId }
      })
    } else {
      announce = await prisma.forumAnnouncement.update({
        data: { ...data, ...audio },
        where: { id: isSet.id }
      })
    }
    
    return { success: true, message: 'Announcement Updated!', announce }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})