import artworksData from '~/data/artworks-scraped.json'

export type GalleryArtwork = {
  id: string
  title: string
  year: string
  medium: string
  dim: string
  location: string
  subject: string
  image: string
  signature: string
  tags: string[]
  status: 'published'
  blurb: string
}

export type JournalEntry = {
  id: string
  date: string
  title: string
  dek: string
  author: string
}

type RawArtwork = {
  title: string
  image: string
  slug: string
  location: string | null
  subject: string | null
  medium: string | null
  date: string | null
  signature: string | null
  dimensions: string | null
  blurb: string | null
}

const ARTWORKS: GalleryArtwork[] = (artworksData as RawArtwork[]).map((raw, i) => ({
  id: raw.slug.replace(/\//g, '-'),
  title: raw.title,
  year: raw.date || '',
  medium: raw.medium || '',
  dim: raw.dimensions || '',
  location: raw.location || '',
  subject: raw.subject || '',
  image: raw.image,
  signature: raw.signature || '',
  tags: [raw.subject, raw.medium].filter(Boolean) as string[],
  status: 'published' as const,
  blurb: raw.blurb || '',
}))

const JOURNAL: JournalEntry[] = [
  { id: 'j-001', date: '03 December 2025', title: 'The Knighton-Hammond Gallery Project', dek: 'The Trust is seeking a partner organisation to establish a permanent gallery for the display of works by the Nottingham artist, Arthur Henry Knighton-Hammond.', author: 'Michael Hammond, Chair' },
  { id: 'j-002', date: '28 October 2025', title: 'One hundred and one years ago today', dek: 'On this date in 1924, Knighton-Hammond sailed from Liverpool to New York to begin his commission for the Dow Chemical Company in Midland, Michigan.', author: 'Peter Norris, Secretary' },
  { id: 'j-003', date: '04 October 2025', title: 'Knighton Hammond Work in Public Collections', dek: 'A survey of Knighton-Hammond works held in public galleries and museum collections across the UK and beyond.', author: 'Peter Norris, Secretary' },
  { id: 'j-004', date: '30 September 2025', title: 'Knighton-Hammond Exhibition at NTU Brackenhurst Campus', dek: 'An exhibition of works by Arthur Henry Knighton-Hammond at Nottingham Trent University\'s Brackenhurst Campus.', author: 'Michael Hammond, Chair' },
  { id: 'j-005', date: '22 September 2025', title: 'The Opening Evening at NTU Brackenhurst Campus', dek: 'The opening evening for the exhibition of works by Knighton-Hammond at Nottingham Trent University.', author: 'Peter Norris, Secretary' },
]

export const useArtworks = () => ({
  artworks: ARTWORKS as readonly GalleryArtwork[],
  journal: JOURNAL as readonly JournalEntry[],
})
