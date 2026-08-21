// One-shot Firestore seed: artworks-scraped.json (+ dominant colours from the
// legacy SQLite db where slugs/titles match) -> artworks/{slug} docs + the
// catalog/artworks summary doc the public site reads.
// Usage: GOOGLE_APPLICATION_CREDENTIALS=<sa-key> node scripts/seed-firestore.mjs
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Database from 'better-sqlite3';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IMAGES_DIR = process.env.IMAGES_DIR || path.join(path.dirname(root), 'kh-data', 'uploads');

const artworks = JSON.parse(
  readFileSync(path.join(root, 'packages/frontend/data/artworks-scraped.json'), 'utf8')
);

const dbPath = path.join(root, 'packages/backend/data/kh.db');
const bySlug = new Map();
const byTitle = new Map();
if (existsSync(dbPath)) {
  const db = new Database(dbPath, { readonly: true });
  for (const row of db.prepare('SELECT slug, title, dominant_color FROM artworks').all()) {
    bySlug.set(row.slug, row);
    byTitle.set(row.title.trim().toLowerCase(), row);
  }
  db.close();
}

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

initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT || 'ajh-kh-gallery',
});
const firestore = getFirestore();

const hex = (v) => v.toString(16).padStart(2, '0');
const dominantColor = async (slug) => {
  const { dominant } = await sharp(path.join(IMAGES_DIR, 'thumb', `${slug}.jpg`)).stats();
  return `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`;
};

let missingImages = 0;
const docs = await Promise.all(artworks.map(async (a, i) => {
  const legacy = bySlug.get(a.slug) || byTitle.get(a.title.trim().toLowerCase());
  const hasImage = existsSync(path.join(IMAGES_DIR, 'thumb', `${a.slug}.jpg`));
  if (!hasImage) {
    missingImages++;
    console.warn(`missing image: ${a.slug}`);
  }
  const summary = {
    slug: a.slug,
    title: a.title.trim(),
    date: a.date?.trim() || null,
    decade: toDecade(a.date),
    medium: a.medium?.trim() || null,
    subject: a.subject?.trim() || null,
    location: a.location?.trim() || null,
    signature: a.signature?.trim() || null,
    dimensions: a.dimensions?.trim() || null,
    dominantColor: legacy?.dominant_color || (hasImage ? await dominantColor(a.slug) : '#8a8174'),
  };
  return {
    ...summary,
    description: a.blurb ? decodeEntities(a.blurb) : null,
    imageBase: '/images',
    published: true,
    displayOrder: i,
  };
}));

const items = docs.map(({ description, imageBase, published, displayOrder, ...summary }) => summary);

let batch = firestore.batch();
let n = 0;
for (const d of docs) {
  batch.set(firestore.doc(`artworks/${d.slug}`), {
    ...d,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  if (++n % 400 === 0) {
    await batch.commit();
    batch = firestore.batch();
  }
}
await batch.commit();

await firestore.doc('catalog/artworks').set({
  items,
  count: items.length,
  updatedAt: FieldValue.serverTimestamp(),
});

console.log(`Seeded ${docs.length} artworks (+catalog); ${missingImages} missing images; ` +
  `${docs.filter((d) => d.dominantColor === '#8a8174').length} without legacy colour match`);
