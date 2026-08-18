import { doc, getDoc } from 'firebase/firestore'

export type GalleryArtwork = {
  id: string
  title: string
  year: string
  decade: string
  medium: string
  dim: string
  location: string
  subject: string
  image: string
  signature: string
  dominantColor: string | null
  tags: string[]
  status: 'published' | 'draft'
  blurb: string
}

export type JournalEntry = {
  id: string
  date: string
  title: string
  dek: string
  author: string
}

export type CatalogItem = {
  slug: string
  title: string
  date: string | null
  decade: string | null
  medium: string | null
  subject: string | null
  location: string | null
  signature: string | null
  dimensions: string | null
  dominantColor: string | null
}

export type ArtworkDoc = CatalogItem & {
  description: string | null
  imageBase: string | null
  published: boolean
  displayOrder: number
}

const JOURNAL: JournalEntry[] = [
  { id: 'j-001', date: '03 December 2025', title: 'The Knighton-Hammond Gallery Project', dek: 'The Trust is seeking a partner organisation to establish a permanent gallery for the display of works by the Nottingham artist, Arthur Henry Knighton-Hammond.', author: 'Michael Hammond, Chair' },
  { id: 'j-002', date: '28 October 2025', title: 'One hundred and one years ago today', dek: 'On this date in 1924, Knighton-Hammond sailed from Liverpool to New York to begin his commission for the Dow Chemical Company in Midland, Michigan.', author: 'Peter Norris, Secretary' },
  { id: 'j-003', date: '04 October 2025', title: 'Knighton Hammond Work in Public Collections', dek: 'A survey of Knighton-Hammond works held in public galleries and museum collections across the UK and beyond.', author: 'Peter Norris, Secretary' },
  { id: 'j-004', date: '30 September 2025', title: 'Knighton-Hammond Exhibition at NTU Brackenhurst Campus', dek: 'An exhibition of works by Arthur Henry Knighton-Hammond at Nottingham Trent University\'s Brackenhurst Campus.', author: 'Michael Hammond, Chair' },
  { id: 'j-005', date: '22 September 2025', title: 'The Opening Evening at NTU Brackenhurst Campus', dek: 'The opening evening for the exhibition of works by Knighton-Hammond at Nottingham Trent University.', author: 'Peter Norris, Secretary' },
]

let catalogPromise: Promise<void> | null = null

export const useArtworks = () => {
  const { imageUrl } = useGallery()
  const catalog = useState<GalleryArtwork[]>('kh-catalog', () => [])

  function fromCatalogItem(item: CatalogItem, imageBase?: string | null): GalleryArtwork {
    return {
      id: item.slug,
      title: item.title,
      year: item.date || '',
      decade: item.decade || '',
      medium: item.medium || '',
      dim: item.dimensions || '',
      location: item.location || '',
      subject: item.subject || '',
      image: imageUrl(item.slug, 'large', 'jpg', imageBase),
      signature: item.signature || '',
      dominantColor: item.dominantColor || null,
      tags: [item.subject, item.medium].filter(Boolean) as string[],
      status: 'published',
      blurb: '',
    }
  }

  function loadCatalog(): Promise<void> {
    if (!import.meta.client) return Promise.resolve()
    if (!catalogPromise) {
      const db = useFirebase().getFirestoreDb()
      catalogPromise = getDoc(doc(db, 'catalog', 'artworks'))
        .then((snap) => {
          const items = (snap.exists() ? (snap.data().items as CatalogItem[]) : null) || []
          catalog.value.splice(0, catalog.value.length, ...items.map((it) => fromCatalogItem(it)))
        })
        .catch((err) => {
          catalogPromise = null
          throw err
        })
    }
    return catalogPromise
  }

  if (import.meta.client) {
    loadCatalog().catch((err) => console.error('Failed to load artwork catalogue', err))
  }

  async function getArtwork(slug: string): Promise<GalleryArtwork | null> {
    await loadCatalog().catch(() => {})
    const summary = catalog.value.find((w) => w.id === slug) || null
    try {
      const db = useFirebase().getFirestoreDb()
      const snap = await getDoc(doc(db, 'artworks', slug))
      if (!snap.exists()) return summary
      const d = snap.data() as ArtworkDoc
      return {
        ...fromCatalogItem({ ...d, slug }, d.imageBase),
        status: d.published ? 'published' : 'draft',
        blurb: d.description || '',
      }
    } catch {
      return summary
    }
  }

  return {
    artworks: catalog.value as readonly GalleryArtwork[],
    journal: JOURNAL as readonly JournalEntry[],
    loadCatalog,
    getArtwork,
  }
}
