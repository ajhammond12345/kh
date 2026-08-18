<script setup lang="ts">
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import type { ArtworkDoc, CatalogItem } from '~/composables/useArtworks'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Artworks — Knighton-Hammond Admin' })

const { getFirestoreDb } = useFirebase()
const { imageUrl } = useGallery()

const rows = ref<ArtworkDoc[]>([])
const loading = ref(true)
const loadError = ref('')
const search = ref('')

onMounted(async () => {
  try {
    const snap = await getDocs(collection(getFirestoreDb(), 'artworks'))
    rows.value = snap.docs
      .map((d) => ({ ...(d.data() as ArtworkDoc), slug: d.id }))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  } catch {
    loadError.value = 'The artworks could not be loaded. Please try again.'
  } finally {
    loading.value = false
  }
})

const filtered = computed(() => {
  const needle = search.value.trim().toLowerCase()
  if (!needle) return rows.value
  return rows.value.filter((r) => r.title.toLowerCase().includes(needle))
})

function toCatalogItem(r: ArtworkDoc): CatalogItem {
  return {
    slug: r.slug,
    title: r.title,
    date: r.date ?? null,
    decade: r.decade ?? null,
    medium: r.medium ?? null,
    subject: r.subject ?? null,
    location: r.location ?? null,
    signature: r.signature ?? null,
    dimensions: r.dimensions ?? null,
    dominantColor: r.dominantColor ?? null,
  }
}

// The artworks collection is the source of truth; rebuilding the catalogue
// from it keeps the doc consistent even if a previous sync was interrupted.
async function syncCatalog() {
  const items = rows.value
    .filter((r) => r.published)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map(toCatalogItem)
  await setDoc(doc(getFirestoreDb(), 'catalog', 'artworks'), {
    items,
    count: items.length,
    updatedAt: serverTimestamp(),
  })
}

const editing = ref<ArtworkDoc | null>(null)
const saving = ref(false)
const saveError = ref('')
const form = reactive({
  title: '',
  date: '',
  decade: '',
  medium: '',
  subject: '',
  location: '',
  signature: '',
  dimensions: '',
  description: '',
  published: false,
})

function openEdit(row: ArtworkDoc) {
  editing.value = row
  saveError.value = ''
  Object.assign(form, {
    title: row.title || '',
    date: row.date || '',
    decade: row.decade || '',
    medium: row.medium || '',
    subject: row.subject || '',
    location: row.location || '',
    signature: row.signature || '',
    dimensions: row.dimensions || '',
    description: row.description || '',
    published: !!row.published,
  })
}

async function saveEdit() {
  if (!editing.value) return
  const title = form.title.trim()
  if (!title) {
    saveError.value = 'A title is required.'
    return
  }
  saving.value = true
  saveError.value = ''
  const patch = {
    title,
    date: form.date.trim() || null,
    decade: form.decade.trim() || null,
    medium: form.medium.trim() || null,
    subject: form.subject.trim() || null,
    location: form.location.trim() || null,
    signature: form.signature.trim() || null,
    dimensions: form.dimensions.trim() || null,
    description: form.description.trim() || null,
    published: form.published,
  }
  try {
    await updateDoc(doc(getFirestoreDb(), 'artworks', editing.value.slug), {
      ...patch,
      updatedAt: serverTimestamp(),
    })
    Object.assign(editing.value, patch)
    await syncCatalog()
    editing.value = null
  } catch {
    saveError.value = 'The changes could not be saved. Please try again.'
  } finally {
    saving.value = false
  }
}

async function removeArtwork(row: ArtworkDoc) {
  if (!confirm(`Delete “${row.title}”? This cannot be undone.`)) return
  try {
    await deleteDoc(doc(getFirestoreDb(), 'artworks', row.slug))
    rows.value = rows.value.filter((r) => r.slug !== row.slug)
    await syncCatalog()
  } catch {
    loadError.value = 'The artwork could not be deleted. Please try again.'
  }
}
</script>

<template>
  <div>
    <div class="kha-eyebrow">THE CATALOGUE ROOM</div>
    <h1 class="kha-title">Artworks</h1>

    <div class="kha-card khw-upload">
      <div>
        <div class="khw-upload-title">Add an artwork</div>
        <p class="khw-upload-body">
          Image uploads unlock once Cloud Storage is enabled (billing).
        </p>
      </div>
      <button class="kha-btn" disabled>Upload an image</button>
    </div>

    <input
      v-model="search"
      type="text"
      class="kha-input khw-search"
      placeholder="Search by title…"
    />

    <p v-if="loadError" class="kha-error">{{ loadError }}</p>
    <p v-else-if="loading" class="khw-muted">Loading the catalogue…</p>
    <p v-else-if="filtered.length === 0" class="khw-muted">
      {{ search ? `No artworks match “${search}”.` : 'The catalogue is empty.' }}
    </p>

    <table v-if="filtered.length" class="kha-table">
      <thead>
        <tr>
          <th :style="{ width: '64px' }"></th>
          <th>Title</th>
          <th class="khw-col-wide">Date</th>
          <th class="khw-col-wide">Medium</th>
          <th>Status</th>
          <th :style="{ textAlign: 'right' }">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in filtered" :key="r.slug">
          <td>
            <img
              :src="imageUrl(r.slug, 'thumb', 'jpg', r.imageBase)"
              :alt="r.title"
              class="khw-thumb"
              loading="lazy"
            />
          </td>
          <td>
            <span class="khw-row-title">{{ r.title }}</span>
          </td>
          <td class="khw-col-wide">{{ r.date || '—' }}</td>
          <td class="khw-col-wide">{{ r.medium || '—' }}</td>
          <td>
            <span v-if="!r.published" class="kha-badge">Unpublished</span>
            <span v-else class="khw-published">Published</span>
          </td>
          <td :style="{ textAlign: 'right', whiteSpace: 'nowrap' }">
            <button class="kha-link-btn" @click="openEdit(r)">Edit</button>
            <button class="kha-btn--danger khw-delete" @click="removeArtwork(r)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <Teleport to="body">
      <div v-if="editing" class="khw-overlay" @click.self="editing = null">
        <div class="khw-dialog">
          <div class="khw-dialog-head">
            <div class="khw-dialog-title">{{ editing.title }}</div>
            <button class="khw-dialog-close" aria-label="Close" @click="editing = null">&times;</button>
          </div>
          <form class="khw-form" @submit.prevent="saveEdit">
            <div class="khw-form-grid">
              <div class="khw-form-span">
                <label class="kha-label" for="f-title">Title</label>
                <input id="f-title" v-model="form.title" type="text" class="kha-input" />
              </div>
              <div>
                <label class="kha-label" for="f-date">Date</label>
                <input id="f-date" v-model="form.date" type="text" class="kha-input" placeholder="e.g. 1926" />
              </div>
              <div>
                <label class="kha-label" for="f-decade">Decade</label>
                <input id="f-decade" v-model="form.decade" type="text" class="kha-input" placeholder="e.g. 1920s" />
              </div>
              <div>
                <label class="kha-label" for="f-medium">Medium</label>
                <input id="f-medium" v-model="form.medium" type="text" class="kha-input" />
              </div>
              <div>
                <label class="kha-label" for="f-subject">Subject</label>
                <input id="f-subject" v-model="form.subject" type="text" class="kha-input" />
              </div>
              <div>
                <label class="kha-label" for="f-location">Location</label>
                <input id="f-location" v-model="form.location" type="text" class="kha-input" />
              </div>
              <div>
                <label class="kha-label" for="f-signature">Signature</label>
                <input id="f-signature" v-model="form.signature" type="text" class="kha-input" />
              </div>
              <div>
                <label class="kha-label" for="f-dimensions">Dimensions</label>
                <input id="f-dimensions" v-model="form.dimensions" type="text" class="kha-input" placeholder="e.g. 35 cm x 50 cm" />
              </div>
              <div class="khw-form-span">
                <label class="kha-label" for="f-description">Description</label>
                <textarea id="f-description" v-model="form.description" rows="5" class="kha-textarea" />
              </div>
            </div>
            <label class="khw-publish">
              <input v-model="form.published" type="checkbox" />
              Published — visible in the public library
            </label>
            <p v-if="saveError" class="kha-error">{{ saveError }}</p>
            <div class="khw-dialog-actions">
              <button type="button" class="kha-btn kha-btn--ghost" @click="editing = null">Cancel</button>
              <button type="submit" class="kha-btn" :disabled="saving">
                {{ saving ? 'Saving…' : 'Save changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.khw-upload {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}
.khw-upload-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 4px;
}
.khw-upload-body {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--ink-3);
  margin: 0;
}
.khw-search {
  max-width: 380px;
  margin-bottom: 24px;
}
.khw-muted {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink-3);
}
.khw-thumb {
  width: 48px;
  height: 60px;
  object-fit: cover;
  background: var(--parchment);
  display: block;
}
.khw-row-title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 16px;
  color: var(--ink);
}
.khw-published {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--sage);
  font-weight: 600;
}
.khw-delete {
  margin-left: 16px;
  cursor: pointer;
  font-family: var(--font-ui);
}
.khw-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgb(22 26 34 / 0.58);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 8vh 20px 40px;
  overflow-y: auto;
}
.khw-dialog {
  width: min(640px, 100%);
  background: var(--paper-2);
  box-shadow: var(--shadow-3);
}
.khw-dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--hairline);
}
.khw-dialog-title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 22px;
  color: var(--ink);
}
.khw-dialog-close {
  background: transparent;
  border: 0;
  font-size: 26px;
  line-height: 1;
  color: var(--ink-3);
  cursor: pointer;
}
.khw-form {
  padding: 24px;
}
.khw-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.khw-form-span {
  grid-column: 1 / -1;
}
.khw-publish {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  font-family: var(--font-ui);
  font-size: 13.5px;
  color: var(--ink-2);
  cursor: pointer;
}
.khw-publish input {
  accent-color: var(--sienna);
}
.khw-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 640px) {
  .khw-col-wide {
    display: none;
  }
  .khw-form-grid {
    grid-template-columns: 1fr;
  }
  .khw-upload {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
