import { ServerFile } from "nuxt-file-storage"
import { prisma } from '~/server/utils/prisma'
import { randomUUID } from 'crypto'
import urlSlug from '@/lib/urlSlug'

export default defineEventHandler(async (event) => {
  const { forumSlug, title, html, text, isEdit, editUserId } = await readBody(event)
  const { images } = await readBody<{ images: ServerFile[] }>(event)
  const { docs } = await readBody<{ docs: ServerFile[] }>(event)
  const userId = event.context.user.userId
  
  try {
    
    // get forum
    const forum = await prisma.forum.findFirst({ where: { slug: forumSlug }
    })
    
    // Stop if the forum is locked
    if (forum.locked) {
      return { success: false, message: 'Forum is locked' }
    }
    
    let thread
    
    if (!isEdit) {
      // Add thread
      thread = await prisma.thread.create({
        data: {
          title: title,
          slug: urlSlug(title).slice(0, 50),
          content_html: html,
          content_text: text,
          forumId: forum.id,
          userId: userId
        }
      })

    } else {
      thread = await prisma.thread.update({
        where: { id: isEdit, userId: editUserId, forumId: forum.id, locked: {not: true} },
        data: {
          title: title,
          slug: urlSlug(title).slice(0, 50),
          content_html: html,
          content_text: text
        },
        include: {
          images: true, docs: true
        }
      })
    }
   

    for ( const file of images ) {
      // Extract file extension
      const fileExtension = file.name.split('.').pop()

      const name = randomUUID()
      
      // Construct the filename with extension
      const fileName = `${name}.${fileExtension}`
      
      await storeFileLocally(file, name, '/contents_imgs')
      
      // Save in db
      await prisma.contentImages.create({
        data: {
          url: fileName,
          threadId: thread.id
        }
      })
    }
    
    for ( const doc of docs ) {
      // Extract file extension
      const fileExtension = doc.name.split('.').pop()

      const name = randomUUID()
      
      // Construct the filename with extension
      const fileName = `${name}.${fileExtension}`
      
      await storeFileLocally(doc, name, '/contents_docs')
      
      // Save in db
      await prisma.contentDocs.create({
        data: {
          url: fileName,
          threadId: thread.id
        }
      })
    }

    
    return { success: true, message: 'Thread Updated!', thread }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})