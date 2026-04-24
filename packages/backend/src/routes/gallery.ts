import { Hono } from 'hono'
import { getDb } from '../db/index.js'
import { artworks } from '../db/schema.js'
import { eq, like, and, sql } from 'drizzle-orm'

export const galleryRoutes = new Hono()

galleryRoutes.get('/', async (c) => {
  const db = getDb()
  const search = c.req.query('search') || ''
  const subject = c.req.query('subject') || ''
  const medium = c.req.query('medium') || ''
  const decade = c.req.query('decade') || ''
  const location = c.req.query('location') || ''
  const page = Number(c.req.query('page')) || 0
  const limit = Math.min(Number(c.req.query('limit')) || 24, 100)

  const conditions = [eq(artworks.published, true)]
  if (search) conditions.push(like(artworks.title, `%${search}%`))
  if (subject) conditions.push(eq(artworks.subject, subject))
  if (medium) conditions.push(eq(artworks.medium, medium))
  if (decade) conditions.push(eq(artworks.decade, decade))
  if (location) conditions.push(like(artworks.location, `%${location}%`))

  const where = and(...conditions)

  const [items, countResult] = await Promise.all([
    db.select().from(artworks).where(where)
      .orderBy(artworks.displayOrder)
      .limit(limit)
      .offset(page * limit),
    db.select({ count: sql<number>`count(*)` }).from(artworks).where(where),
  ])

  return c.json({
    artworks: items,
    totalCount: countResult[0].count,
    page,
    limit,
  })
})

galleryRoutes.get('/filters', async (c) => {
  const db = getDb()

  const [subjects, media, decades, locations] = await Promise.all([
    db.selectDistinct({ value: artworks.subject }).from(artworks).where(eq(artworks.published, true)),
    db.selectDistinct({ value: artworks.medium }).from(artworks).where(eq(artworks.published, true)),
    db.selectDistinct({ value: artworks.decade }).from(artworks).where(eq(artworks.published, true)),
    db.selectDistinct({ value: artworks.location }).from(artworks).where(eq(artworks.published, true)),
  ])

  return c.json({
    subjects: subjects.map(s => s.value).filter(Boolean).sort(),
    media: media.map(m => m.value).filter(Boolean).sort(),
    decades: decades.map(d => d.value).filter(Boolean).sort(),
    locations: locations.map(l => l.value).filter(Boolean).sort(),
  })
})

galleryRoutes.get('/:slug', async (c) => {
  const db = getDb()
  const slug = c.req.param('slug')

  const result = await db.select().from(artworks)
    .where(and(eq(artworks.slug, slug), eq(artworks.published, true)))
    .limit(1)

  if (result.length === 0) return c.json({ error: 'Not found' }, 404)
  return c.json(result[0])
})
