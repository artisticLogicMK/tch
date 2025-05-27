// server/api/uploads/[...path].ts
import { readFile } from 'fs/promises'
import { join, extname } from 'path'
import mime from 'mime'

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const filePath = join(process.cwd(), '.output/uploads', ...(Array.isArray(path) ? path : [path]))

  try {
    const file = await readFile(filePath)
    const mimeType = mime.getType(filePath) || 'application/octet-stream'

    setHeader(event, 'Content-Type', mimeType)
    return file
  } catch (err) {
    throw createError({ statusCode: 404, statusMessage: 'File Not Found' })
  }
})