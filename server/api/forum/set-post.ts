import { ServerFile } from "nuxt-file-storage"
import { prisma } from '~/server/utils/prisma'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const { forumSlug, threadSlug, html, text, isEdit, editUserId, quote } = await readBody(event)
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
    
    // get thread
    const thread = await prisma.thread.findFirst({ where: { slug: threadSlug },
      include: {
        _count: { select: { posts: true } }
      }
    })
    
    // Stop if the thread is locked
    if (thread.locked) {
      return { success: false, message: 'Thread is locked' }
    }
    
    let post
    
    if (!isEdit) {
      // Add thread
      post = await prisma.post.create({
        data: {
          content_html: html,
          content_text: text,
          forumId: forum.id,
          threadId: thread.id,
          userId: userId,
          quote
        }
      })
      
      // Update thread to bring it to top
      await prisma.thread.update({
        where: { id: thread.id },
        data: { title: thread.title }
      })
    } else {
      post = await prisma.post.update({
        where: { id: isEdit, userId: editUserId, forumId: forum.id, threadId: thread.id, locked: {not: true} },
        data: {
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
          postId: post.id
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
          postId: post.id
        }
      })
    }
    
    //
    const totalPosts = thread?._count?.posts || 0
    const totalPages = Math.ceil(totalPosts / Number(process.env.POSTS_LIMIT))
    
    return { success: true, message: 'Post Updated!', post, lastPage: totalPages }
    
  } catch (error) {
    console.error(error)
    return { success: false, message: 'An error occured' }
  }
})