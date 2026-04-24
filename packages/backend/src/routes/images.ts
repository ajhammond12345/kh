import { Hono } from 'hono'
import { createReadStream, existsSync } from 'fs'
import { Readable } from 'stream'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '../../data/uploads')

export const imageRoutes = new Hono()

const VALID_SIZES = ['thumb', 'medium', 'large', 'original'] as const

imageRoutes.get('/:id/:size', async (c) => {
  const id = c.req.param('id')
  const size = c.req.param('size') as typeof VALID_SIZES[number]

  if (!VALID_SIZES.includes(size)) {
    return c.json({ error: 'Invalid size' }, 400)
  }

  const webpPath = path.join(UPLOADS_DIR, size, `${id}.webp`)
  const jpgPath = path.join(UPLOADS_DIR, size, `${id}.jpg`)

  const accept = c.req.header('accept') || ''
  const filePath = accept.includes('image/webp') && existsSync(webpPath) ? webpPath : jpgPath

  if (!existsSync(filePath)) {
    return c.json({ error: 'Image not found' }, 404)
  }

  const contentType = filePath.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
  const stream = createReadStream(filePath)
  const webStream = Readable.toWeb(stream) as ReadableStream

  return new Response(webStream, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
})
