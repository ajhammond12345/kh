import type { ImageFormat, ImageSize } from '~/composables/useGallery'

// Same widths as the static kh-data/uploads tree.
const WIDTHS: Record<ImageSize, number> = { thumb: 300, medium: 800, large: 1200 }

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export type ImageVariant = { size: ImageSize; format: ImageFormat; blob: Blob }

export type ProcessedImage = {
  variants: ImageVariant[]
  dominantColor: string
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode image'))), type, quality),
  )
}

function averageColor(bitmap: ImageBitmap): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

export async function processArtworkImage(file: File): Promise<ProcessedImage> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Please choose a JPEG, PNG or WebP photo.')
  }
  const bitmap = await createImageBitmap(file)
  const variants: ImageVariant[] = []
  for (const size of Object.keys(WIDTHS) as ImageSize[]) {
    const width = Math.min(WIDTHS[size], bitmap.width)
    const height = Math.round((bitmap.height * width) / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, width, height)
    const jpg = await toBlob(canvas, 'image/jpeg', 0.86)
    // Safari can't encode WebP and silently returns PNG; the gallery's
    // <picture> always requests a .webp, so fall back to the JPEG bytes there
    // (browsers sniff the real format).
    const webp = await toBlob(canvas, 'image/webp', 0.82)
    variants.push({ size, format: 'jpg', blob: jpg })
    variants.push({ size, format: 'webp', blob: webp.type === 'image/webp' ? webp : jpg })
  }
  const dominantColor = averageColor(bitmap)
  bitmap.close()
  return { variants, dominantColor }
}

export function slugify(title: string): string {
  return (
    title
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
      .replace(/-+$/, '') || 'artwork'
  )
}

export function toDecade(date: string | null): string | null {
  const m = date?.match(/\b(\d{3})\d\b/)
  return m ? `${m[1]}0s` : null
}
