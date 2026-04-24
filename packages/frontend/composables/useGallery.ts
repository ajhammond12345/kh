interface Artwork {
  id: number
  slug: string
  title: string
  year: number | null
  decade: string | null
  medium: string | null
  subject: string | null
  location: string | null
  signature: string | null
  dimensions: string | null
  description: string | null
  imagePath: string | null
  dominantColor: string | null
  displayOrder: number
}

interface GalleryResponse {
  artworks: Artwork[]
  totalCount: number
  page: number
  limit: number
}

interface FilterOptions {
  subjects: string[]
  media: string[]
  decades: string[]
  locations: string[]
}

export function useGallery() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  async function fetchArtworks(params: {
    search?: string
    subject?: string
    medium?: string
    decade?: string
    location?: string
    page?: number
    limit?: number
  } = {}): Promise<GalleryResponse> {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.subject) query.set('subject', params.subject)
    if (params.medium) query.set('medium', params.medium)
    if (params.decade) query.set('decade', params.decade)
    if (params.location) query.set('location', params.location)
    if (params.page !== undefined) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))

    const res = await fetch(`${apiBase}/api/gallery?${query}`)
    return res.json()
  }

  async function fetchArtwork(slug: string): Promise<Artwork | null> {
    const res = await fetch(`${apiBase}/api/gallery/${slug}`)
    if (!res.ok) return null
    return res.json()
  }

  async function fetchFilters(): Promise<FilterOptions> {
    const res = await fetch(`${apiBase}/api/gallery/filters`)
    return res.json()
  }

  function imageUrl(slug: string | null, size: 'thumb' | 'medium' | 'large' = 'medium'): string {
    if (!slug) return ''
    return `${apiBase}/api/images/${slug}/${size}`
  }

  return { fetchArtworks, fetchArtwork, fetchFilters, imageUrl }
}

export type { Artwork, GalleryResponse, FilterOptions }
