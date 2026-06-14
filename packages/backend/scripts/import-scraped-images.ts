import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { processImage } from '../src/services/image-pipeline.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../../frontend/data/artworks-scraped.json')
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '../data/uploads')
const CONCURRENCY = 8

type RawArtwork = { title: string; image: string; slug: string }

// Must match the id the frontend uses (composables/useArtworks.ts) so the
// generated files line up with /api/images/:id/:size requests.
const idFor = (slug: string) => slug.replace(/\//g, '-')

const force = process.argv.includes('--force')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity

const all: RawArtwork[] = JSON.parse(readFileSync(DATA_FILE, 'utf8'))
const items = Number.isFinite(limit) ? all.slice(0, limit) : all

let done = 0
let skipped = 0
let failed = 0

async function importOne(raw: RawArtwork) {
  const id = idFor(raw.slug)
  const marker = path.join(UPLOADS_DIR, 'original', `${id}.jpg`)
  if (!force && existsSync(marker)) {
    skipped++
    return
  }
  try {
    const res = await fetch(raw.image)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    await processImage(buffer, id)
    done++
    console.log(`[ok]   ${id}`)
  } catch (e) {
    failed++
    console.error(`[fail] ${id} <- ${raw.image}: ${(e as Error).message}`)
  }
}

console.log(`Importing ${items.length} image(s) -> ${UPLOADS_DIR} (concurrency ${CONCURRENCY})`)

const queue = [...items]
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await importOne(queue.shift()!)
  }),
)

console.log(`\nDone. processed=${done} skipped=${skipped} failed=${failed} total=${items.length}`)
