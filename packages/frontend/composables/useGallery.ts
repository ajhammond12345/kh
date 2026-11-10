export type ImageSize = 'thumb' | 'medium' | 'large'
export type ImageFormat = 'jpg' | 'webp'

export function useGallery() {
  const config = useRuntimeConfig()

  function imageUrl(
    name: string | null,
    size: ImageSize = 'medium',
    format: ImageFormat = 'jpg',
    base?: string | null,
  ): string {
    if (!name) return ''
    return `${base || config.public.imageBase}/${size}/${name}.${format}`
  }

  return { imageUrl }
}
