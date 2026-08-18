export type ImageSize = 'thumb' | 'medium' | 'large'
export type ImageFormat = 'jpg' | 'webp'

export function useGallery() {
  const config = useRuntimeConfig()

  function imageUrl(
    slug: string | null,
    size: ImageSize = 'medium',
    format: ImageFormat = 'jpg',
    base?: string | null,
  ): string {
    if (!slug) return ''
    return `${base || config.public.imageBase}/${size}/${slug}.${format}`
  }

  return { imageUrl }
}
