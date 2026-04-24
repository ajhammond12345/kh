import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { galleryRoutes } from './routes/gallery.js'
import { imageRoutes } from './routes/images.js'
import { authRoutes } from './routes/auth.js'
import { uploadRoutes } from './routes/upload.js'
import { contentRoutes } from './routes/content.js'
import { initDb } from './db/index.js'

const app = new Hono()

app.use('*', logger())
app.use('/api/*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3100',
  credentials: true,
}))

initDb()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api/gallery', galleryRoutes)
app.route('/api/images', imageRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/admin', uploadRoutes)
app.route('/api/admin/content', contentRoutes)

app.use('/*', serveStatic({ root: './static' }))

const port = Number(process.env.PORT) || 3000
console.log(`Server running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
