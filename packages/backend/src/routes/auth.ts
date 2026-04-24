import { Hono } from 'hono'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { getDb } from '../db/index.js'
import { users, sessions } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import argon2 from 'argon2'
import { nanoid } from 'nanoid'

export const authRoutes = new Hono()

authRoutes.post('/login', async (c) => {
  const { username, password } = await c.req.json<{ username: string; password: string }>()
  const db = getDb()

  const user = await db.select().from(users).where(eq(users.username, username)).limit(1)
  if (user.length === 0) return c.json({ error: 'Invalid credentials' }, 401)

  const valid = await argon2.verify(user[0].passwordHash, password)
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401)

  const sessionId = nanoid(32)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  await db.insert(sessions).values({ id: sessionId, userId: user[0].id, expiresAt })

  setCookie(c, 'session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })

  return c.json({ ok: true })
})

authRoutes.post('/logout', async (c) => {
  const sessionId = getCookie(c, 'session')
  if (sessionId) {
    const db = getDb()
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  }
  deleteCookie(c, 'session')
  return c.json({ ok: true })
})

authRoutes.get('/me', async (c) => {
  const sessionId = getCookie(c, 'session')
  if (!sessionId) return c.json({ error: 'Not authenticated' }, 401)

  const db = getDb()
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1)

  if (session.length === 0 || new Date(session[0].expiresAt) < new Date()) {
    if (session.length > 0) await db.delete(sessions).where(eq(sessions.id, sessionId))
    deleteCookie(c, 'session')
    return c.json({ error: 'Session expired' }, 401)
  }

  const user = await db.select({ id: users.id, username: users.username })
    .from(users).where(eq(users.id, session[0].userId)).limit(1)

  return c.json(user[0])
})
