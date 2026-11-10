// Shared by seed-firestore.mjs and add-artworks.mjs: artworks-scraped.json
// entries -> artworks/{slug} docs, and the catalog/artworks summary.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

export const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const IMAGES_DIR = process.env.IMAGES_DIR || path.join(path.dirname(root), 'kh-data', 'uploads');

export const loadScraped = () =>
  JSON.parse(readFileSync(path.join(root, 'packages/frontend/data/artworks-scraped.json'), 'utf8'));

const decodeEntities = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const toDecade = (date) => {
  if (!date) return null;
  const d = date.trim();
  if (/^\d{4}s$/.test(d)) return d;
  const m = d.match(/\b(\d{4})\b/);
  return m ? `${Math.floor(Number(m[1]) / 10) * 10}s` : null;
};

const hex = (v) => v.toString(16).padStart(2, '0');
const dominantColor = async (slug) => {
  const { dominant } = await sharp(path.join(IMAGES_DIR, 'thumb', `${slug}.jpg`)).stats();
  return `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`;
};

export const hasImage = (slug) => existsSync(path.join(IMAGES_DIR, 'thumb', `${slug}.jpg`));

export async function toArtworkDoc(a, { displayOrder, legacyColor }) {
  return {
    slug: a.slug,
    title: a.title.trim(),
    date: a.date?.trim() || null,
    decade: toDecade(a.date),
    medium: a.medium?.trim() || null,
    subject: a.subject?.trim() || null,
    location: a.location?.trim() || null,
    signature: a.signature?.trim() || null,
    dimensions: a.dimensions?.trim() || null,
    dominantColor: legacyColor || (hasImage(a.slug) ? await dominantColor(a.slug) : '#8a8174'),
    description: a.blurb ? decodeEntities(a.blurb) : null,
    imageBase: '/images',
    published: true,
    displayOrder,
  };
}

// Same shape the admin UI writes (useArtworkAdmin toCatalogItem).
const CATALOG_FIELDS = ['slug', 'title', 'date', 'decade', 'medium', 'subject', 'location', 'signature',
  'dimensions', 'dominantColor', 'imageBase', 'imageName'];
export const catalogItem = (d) => Object.fromEntries(CATALOG_FIELDS.map((k) => [k, d[k] ?? null]));
