import { Hono } from 'hono'
import { getDb } from '../db/index.js'
import { pageContent } from '../db/schema.js'
import { eq, sql } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth.js'

export const contentRoutes = new Hono()

contentRoutes.get('/:slug', async (c) => {
  const db = getDb()
  const slug = c.req.param('slug')

  const result = await db.select().from(pageContent).where(eq(pageContent.slug, slug)).limit(1)
  if (result.length === 0) return c.json({ error: 'Not found' }, 404)
  return c.json(result[0])
})

contentRoutes.put('/:slug', authMiddleware, async (c) => {
  const db = getDb()
  const slug = c.req.param('slug')
  const { title, content } = await c.req.json<{ title: string; content: string }>()

  const existing = await db.select().from(pageContent).where(eq(pageContent.slug, slug)).limit(1)

  if (existing.length === 0) {
    const result = await db.insert(pageContent).values({
      slug,
      title,
      content,
    }).returning()
    return c.json(result[0], 201)
  }

  const result = await db.update(pageContent)
    .set({ title, content, updatedAt: sql`datetime('now')` })
    .where(eq(pageContent.slug, slug))
    .returning()

  return c.json(result[0])
})
