import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { getDb } from '../db/index.js'
import { sessions } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const sessionId = getCookie(c, 'session')
  if (!sessionId) return c.json({ error: 'Not authenticated' }, 401)

  const db = getDb()
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1)

  if (session.length === 0 || new Date(session[0].expiresAt) < new Date()) {
    return c.json({ error: 'Session expired' }, 401)
  }

  await next()
}
