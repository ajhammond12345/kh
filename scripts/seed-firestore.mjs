// One-shot Firestore seed: artworks-scraped.json (+ dominant colours from the
// legacy SQLite db where slugs/titles match) -> artworks/{slug} docs + the
// catalog/artworks summary doc the public site reads.
// Overwrites every artworks/ doc, so it only runs against dev or an emulator —
// prod holds admin edits and approved submissions it would clobber. To add
// works to prod use scripts/add-artworks.mjs.
// Usage: GOOGLE_APPLICATION_CREDENTIALS=<sa-key> node scripts/seed-firestore.mjs
import { existsSync } from 'node:fs';
import path from 'node:path';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Database from 'better-sqlite3';
import { root, loadScraped, hasImage, toArtworkDoc, catalogItem } from './artwork-records.mjs';

const artworks = loadScraped();

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

const SEEDABLE_PROJECTS = ['ajh-kh-gallery-dev'];
const projectId = process.env.FIREBASE_PROJECT || 'ajh-kh-gallery-dev';
if (!SEEDABLE_PROJECTS.includes(projectId) && !process.env.FIRESTORE_EMULATOR_HOST) {
  console.error(`Refusing to seed ${projectId}: seeding is only allowed on ${SEEDABLE_PROJECTS.join(', ')} or the emulator.`);
  process.exit(1);
}

initializeApp({
  credential: applicationDefault(),
  projectId,
});
const firestore = getFirestore();

let missingImages = 0;
const docs = await Promise.all(artworks.map(async (a, i) => {
  const legacy = bySlug.get(a.slug) || byTitle.get(a.title.trim().toLowerCase());
  if (!hasImage(a.slug)) {
    missingImages++;
    console.warn(`missing image: ${a.slug}`);
  }
  return toArtworkDoc(a, { displayOrder: i, legacyColor: legacy?.dominant_color });
}));

const items = docs.map(catalogItem);

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
