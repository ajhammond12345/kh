import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, existsSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '../../data/uploads')

const SIZES = {
  thumb: { width: 300, quality: 80 },
  medium: { width: 800, quality: 85 },
  large: { width: 1600, quality: 90 },
} as const

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

export async function processImage(buffer: Buffer, slug: string): Promise<{ dominantColor: string }> {
  const image = sharp(buffer)
  const metadata = await image.metadata()
  const { dominant } = await image.stats()
  const dominantColor = `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`

  const originalDir = path.join(UPLOADS_DIR, 'original')
  ensureDir(originalDir)
  await sharp(buffer).toFile(path.join(originalDir, `${slug}.jpg`))

  for (const [size, config] of Object.entries(SIZES)) {
    const dir = path.join(UPLOADS_DIR, size)
    ensureDir(dir)

    const resized = sharp(buffer).resize(config.width, undefined, { withoutEnlargement: true })

    await Promise.all([
      resized.clone().webp({ quality: config.quality }).toFile(path.join(dir, `${slug}.webp`)),
      resized.clone().jpeg({ quality: config.quality }).toFile(path.join(dir, `${slug}.jpg`)),
    ])
  }

  return { dominantColor }
}

export async function deleteImage(slug: string) {
  const { unlinkSync } = await import('fs')
  for (const size of ['thumb', 'medium', 'large', 'original']) {
    const dir = path.join(UPLOADS_DIR, size)
    for (const ext of ['.webp', '.jpg']) {
      const filePath = path.join(dir, `${slug}${ext}`)
      if (existsSync(filePath)) unlinkSync(filePath)
    }
  }
}
