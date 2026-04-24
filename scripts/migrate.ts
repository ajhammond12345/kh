import Database from 'better-sqlite3'
import sharp from 'sharp'
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '../packages/backend/data/kh.db')
const UPLOADS_DIR = path.join(__dirname, '../packages/backend/data/uploads')

const BASE_URL = 'http://www.knighton-hammond.com'
const BLOB_BASE = 'https://webfuel.blob.core.windows.net/webfuel-filesystem/8551ca70-3fd8-b1c7-d133-08d69bd28840'

const SIZES = {
  thumb: { width: 300, quality: 80 },
  medium: { width: 800, quality: 85 },
  large: { width: 1600, quality: 90 },
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

const usedSlugs = new Set<string>()

function slugify(text: string): string {
  let base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  let slug = base
  let counter = 2
  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter++
  }
  usedSlugs.add(slug)
  return slug
}

async function fetchArtworkList(page: number, take: number): Promise<{ totalCount: number; artworks: Array<{ title: string; image: string; path: string }> }> {
  const res = await fetch(`${BASE_URL}/api/loadArtwork`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ search: '', take, page, filters: [] }),
  })
  return res.json()
}

async function scrapeArtworkDetail(detailPath: string): Promise<{
  location: string | null
  subject: string | null
  medium: string | null
  decade: string | null
  signature: string | null
  dimensions: string | null
  description: string | null
}> {
  try {
    const res = await fetch(`${BASE_URL}${detailPath}`)
    const html = await res.text()

    const extract = (label: string): string | null => {
      const regex = new RegExp(`<b>${label}:</b>\\s*([\\s\\S]*?)</p>`, 'i')
      const match = html.match(regex)
      if (!match) return null
      return match[1].replace(/<[^>]+>/g, '').trim() || null
    }

    const descMatch = html.match(/<div class="description">\s*([\s\S]*?)\s*<\/div>/i)
    const description = descMatch
      ? descMatch[1].replace(/<[^>]+>/g, '').trim() || null
      : null

    return {
      location: extract('Location'),
      subject: extract('Subject'),
      medium: extract('Medium'),
      decade: extract('Date'),
      signature: extract('Signature'),
      dimensions: extract('Dimensions'),
      description,
    }
  } catch (e) {
    console.error(`  Failed to scrape ${detailPath}:`, e)
    return { location: null, subject: null, medium: null, decade: null, signature: null, dimensions: null, description: null }
  }
}

async function downloadAndProcessImage(imageUrl: string, slug: string): Promise<string | null> {
  try {
    let url = imageUrl
    if (!url.startsWith('http')) {
      url = `${BLOB_BASE}${url}`
    }

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())

    const originalDir = path.join(UPLOADS_DIR, 'original')
    ensureDir(originalDir)
    await sharp(buffer).jpeg({ quality: 95 }).toFile(path.join(originalDir, `${slug}.jpg`))

    for (const [size, config] of Object.entries(SIZES)) {
      const dir = path.join(UPLOADS_DIR, size)
      ensureDir(dir)
      const resized = sharp(buffer).resize(config.width, undefined, { withoutEnlargement: true })
      await Promise.all([
        resized.clone().webp({ quality: config.quality }).toFile(path.join(dir, `${slug}.webp`)),
        resized.clone().jpeg({ quality: config.quality }).toFile(path.join(dir, `${slug}.jpg`)),
      ])
    }

    const { dominant } = await sharp(buffer).stats()
    return `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`
  } catch (e) {
    console.error(`  Failed to process image for ${slug}:`, e)
    return null
  }
}

async function downloadStaticAssets() {
  console.log('Downloading static assets...')
  const publicDir = path.join(__dirname, '../packages/frontend/public/images')
  ensureDir(publicDir)

  const assets = [
    { url: `${BLOB_BASE}/design/logo.png`, name: 'logo.png' },
    { url: `${BLOB_BASE}/temp/harbouratmenton.jpg`, name: 'hero-banner.jpg' },
    { url: `${BLOB_BASE}/images/peterandmichael.png`, name: 'trust-photo.jpg' },
    { url: `${BLOB_BASE}/design/artwork-banner.jpg`, name: 'gallery-banner.jpg' },
  ]

  for (const asset of assets) {
    try {
      const res = await fetch(asset.url)
      if (!res.ok) {
        console.log(`  Skipped ${asset.name} (HTTP ${res.status})`)
        continue
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      if (asset.name.endsWith('.jpg') && !asset.url.endsWith('.jpg')) {
        await sharp(buffer).jpeg({ quality: 90 }).toFile(path.join(publicDir, asset.name))
      } else {
        writeFileSync(path.join(publicDir, asset.name), buffer)
      }
      console.log(`  Downloaded ${asset.name}`)
    } catch (e) {
      console.error(`  Failed ${asset.name}:`, e)
    }
  }
}

async function main() {
  console.log('=== Knighton-Hammond Migration ===\n')

  ensureDir(path.dirname(DB_PATH))
  const sqlite = new Database(DB_PATH)
  sqlite.pragma('journal_mode = WAL')

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      year INTEGER,
      decade TEXT,
      medium TEXT,
      subject TEXT,
      location TEXT,
      signature TEXT,
      dimensions TEXT,
      description TEXT,
      image_path TEXT,
      dominant_color TEXT,
      has_watermark INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `)

  // Pre-load existing slugs
  const existingSlugs = sqlite.prepare('SELECT slug FROM artworks').all() as { slug: string }[]
  for (const row of existingSlugs) usedSlugs.add(row.slug)
  console.log(`Found ${existingSlugs.length} existing artworks in DB\n`)

  await downloadStaticAssets()

  console.log('\nFetching artwork list...')
  const firstPage = await fetchArtworkList(0, 50)
  const totalCount = firstPage.totalCount
  console.log(`Found ${totalCount} artworks\n`)

  const allArtworks: Array<{ title: string; image: string; path: string }> = [...firstPage.artworks]
  const totalPages = Math.ceil(totalCount / 50)

  for (let page = 1; page < totalPages; page++) {
    console.log(`Fetching page ${page + 1}/${totalPages}...`)
    const result = await fetchArtworkList(page, 50)
    allArtworks.push(...result.artworks)
  }

  console.log(`\nTotal artworks fetched: ${allArtworks.length}\n`)

  const insertStmt = sqlite.prepare(`
    INSERT OR IGNORE INTO artworks (slug, title, decade, medium, subject, location, signature, dimensions, description, image_path, dominant_color, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const existingCount = (sqlite.prepare('SELECT COUNT(*) as c FROM artworks').get() as { c: number }).c
  let processed = 0
  let skipped = 0

  // Skip artworks we've already processed (by count)
  const startFrom = existingCount

  for (let i = 0; i < allArtworks.length; i++) {
    const artwork = allArtworks[i]

    if (i < startFrom) {
      skipped++
      continue
    }

    const slug = slugify(artwork.title)

    processed++
    console.log(`[${processed}/${allArtworks.length - skipped}] ${artwork.title}`)

    const detail = await scrapeArtworkDetail(artwork.path)
    const dominantColor = await downloadAndProcessImage(artwork.image, slug)

    insertStmt.run(
      slug,
      artwork.title,
      detail.decade,
      detail.medium,
      detail.subject,
      detail.location,
      detail.signature,
      detail.dimensions,
      detail.description,
      slug,
      dominantColor,
      processed,
    )

    // Rate limit
    if (processed % 10 === 0) {
      console.log(`  ... ${processed} processed, pausing briefly`)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  console.log(`\n=== Migration Complete ===`)
  console.log(`Processed: ${processed}`)
  console.log(`Skipped (already existed): ${skipped}`)
  console.log(`Database: ${DB_PATH}`)
  console.log(`Images: ${UPLOADS_DIR}`)

  sqlite.close()
}

main().catch(console.error)
