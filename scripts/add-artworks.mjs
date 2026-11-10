// Adds specific works from artworks-scraped.json to a live project without
// touching any other artwork doc, then rebuilds catalog/artworks from the
// artworks collection. Existing slugs are skipped. New works go to the top of
// the library. Images must already be in kh-data/uploads (shipped by deploy.sh).
// Usage: GOOGLE_APPLICATION_CREDENTIALS=<sa-key> FIREBASE_PROJECT=ajh-kh-gallery \
//          node scripts/add-artworks.mjs <slug> [<slug>...]
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { loadScraped, hasImage, toArtworkDoc, catalogItem } from './artwork-records.mjs';

const slugs = process.argv.slice(2);
const projectId = process.env.FIREBASE_PROJECT;
if (!slugs.length || !projectId) {
  console.error('usage: FIREBASE_PROJECT=<project> node scripts/add-artworks.mjs <slug> [<slug>...]');
  process.exit(1);
}

const scraped = new Map(loadScraped().map((a) => [a.slug, a]));
const missing = slugs.filter((s) => !scraped.has(s) || !hasImage(s));
if (missing.length) {
  console.error(`not in artworks-scraped.json or missing images: ${missing.join(', ')}`);
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId });
const firestore = getFirestore();

const existing = await firestore.collection('artworks').get();
const taken = new Set(existing.docs.map((d) => d.id));
const minOrder = Math.min(0, ...existing.docs.map((d) => d.get('displayOrder') ?? 0));
const toAdd = slugs.filter((s) => !taken.has(s));
for (const s of slugs.filter((s) => taken.has(s))) console.log(`skip (exists): ${s}`);

const batch = firestore.batch();
const added = [];
for (const [i, slug] of toAdd.entries()) {
  const doc = await toArtworkDoc(scraped.get(slug), { displayOrder: minOrder - toAdd.length + i });
  batch.set(firestore.doc(`artworks/${slug}`), {
    ...doc,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  added.push(doc);
}
await batch.commit();

const all = [...existing.docs.map((d) => ({ ...d.data(), slug: d.id })), ...added];
const items = all
  .filter((d) => d.published)
  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  .map(catalogItem);
await firestore.doc('catalog/artworks').set({ items, count: items.length, updatedAt: FieldValue.serverTimestamp() });

console.log(`added ${added.length} (${added.map((d) => d.slug).join(', ') || 'none'}); catalog now ${items.length} published`);
