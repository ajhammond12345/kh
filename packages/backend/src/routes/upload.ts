import { Hono } from 'hono'
import { getDb } from '../db/index.js'
import { artworks } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { processImage, deleteImage } from '../services/image-pipeline.js'
import { authMiddleware } from '../middleware/auth.js'

export const uploadRoutes = new Hono()

uploadRoutes.use('*', authMiddleware)

uploadRoutes.delete('/artwork/:id', async (c) => {
  const db = getDb()
  const id = Number(c.req.param('id'))

  const existing = await db.select().from(artworks).where(eq(artworks.id, id)).limit(1)
  if (existing.length === 0) return c.json({ error: 'Not found' }, 404)

  if (existing[0].imagePath) {
    await deleteImage(existing[0].imagePath)
  }

  await db.delete(artworks).where(eq(artworks.id, id))
  return c.json({ ok: true })
})

uploadRoutes.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('image') as File | null
  const title = formData.get('title') as string
  const medium = formData.get('medium') as string | null
  const subject = formData.get('subject') as string | null
  const decade = formData.get('decade') as string | null
  const location = formData.get('location') as string | null
  const signature = formData.get('signature') as string | null
  const dimensions = formData.get('dimensions') as string | null
  const description = formData.get('description') as string | null

  if (!file || !title) {
    return c.json({ error: 'Image and title are required' }, 400)
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff']
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: 'Invalid file type. Allowed: JPEG, PNG, TIFF' }, 400)
  }

  if (file.size > 50 * 1024 * 1024) {
    return c.json({ error: 'File too large. Maximum 50MB.' }, 400)
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { dominantColor } = await processImage(buffer, slug)

  const db = getDb()
  const result = await db.insert(artworks).values({
    slug,
    title,
    medium,
    subject,
    decade,
    location,
    signature,
    dimensions,
    description,
    imagePath: slug,
    dominantColor,
  }).returning()

  return c.json(result[0], 201)
})
