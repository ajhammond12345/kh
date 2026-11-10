<script setup lang="ts">
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import type { ArtworkDoc } from '~/composables/useArtworks'
import { cleanFields, emptyArtworkFields, fieldsFrom, type ArtworkFields } from '~/composables/useArtworkAdmin'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Artworks — Knighton-Hammond Admin' })

const { getFirestoreDb } = useFirebase()
const { imageUrl } = useGallery()
const { uploadsEnabled, loadArtworks, rebuildCatalog, addArtwork, deleteArtwork } = useArtworkAdmin()

const rows = ref<ArtworkDoc[]>([])
const loading = ref(true)
const loadError = ref('')
const search = ref('')

onMounted(async () => {
  try {
    rows.value = await loadArtworks()
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

const thumbUrl = (r: ArtworkDoc) => imageUrl(r.imageName || r.slug, 'thumb', 'jpg', r.imageBase)

const editing = ref<ArtworkDoc | null>(null)
const saving = ref(false)
const saveError = ref('')
const form = ref<ArtworkFields>(emptyArtworkFields())
const published = ref(false)

function openEdit(row: ArtworkDoc) {
  editing.value = row
  saveError.value = ''
  form.value = fieldsFrom(row)
  published.value = !!row.published
}

async function saveEdit() {
  if (!editing.value) return
  const title = form.value.title.trim()
  if (!title) {
    saveError.value = 'A title is required.'
    return
  }
  saving.value = true
  saveError.value = ''
  const patch = { ...cleanFields(form.value), title, published: published.value }
  try {
    await updateDoc(doc(getFirestoreDb(), 'artworks', editing.value.slug), {
      ...patch,
      updatedAt: serverTimestamp(),
    })
    Object.assign(editing.value, patch)
    await rebuildCatalog(rows.value)
    editing.value = null
  } catch {
    saveError.value = 'The changes could not be saved. Please try again.'
  } finally {
    saving.value = false
  }
}

const adding = ref(false)
const addForm = ref<ArtworkFields>(emptyArtworkFields())
const addFile = ref<File | null>(null)
const addError = ref('')
const addSaving = ref(false)

function openAdd() {
  addForm.value = emptyArtworkFields()
  addFile.value = null
  addError.value = ''
  adding.value = true
}

async function saveAdd() {
  if (!addForm.value.title.trim()) {
    addError.value = 'A title is required.'
    return
  }
  if (!addFile.value) {
    addError.value = 'Please choose a photo of the work.'
    return
  }
  addSaving.value = true
  addError.value = ''
  try {
    await addArtwork(addForm.value, addFile.value)
    rows.value = await loadArtworks()
    adding.value = false
  } catch (err) {
    addError.value = (err as Error)?.message || 'The artwork could not be added. Please try again.'
  } finally {
    addSaving.value = false
  }
}

async function removeArtwork(row: ArtworkDoc) {
  if (!confirm(`Delete “${row.title}”? This cannot be undone.`)) return
  try {
    const remaining = rows.value.filter((r) => r.slug !== row.slug)
    await deleteArtwork(row, remaining)
    rows.value = remaining
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
          {{ uploadsEnabled
            ? 'Upload a photo and the details. It goes straight into the public library.'
            : 'Image uploads are only available on the live site.' }}
        </p>
      </div>
      <button class="kha-btn" :disabled="!uploadsEnabled" @click="openAdd">Add an artwork</button>
    </div>

    <input
      v-model="search"
      type="text"
      class="kha-input khw-search"
      placeholder="Search by title…"
      aria-label="Search by title"
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
            <img :src="thumbUrl(r)" :alt="r.title" class="khw-thumb" loading="lazy" />
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

    <AdminDialog v-if="editing" :title="editing.title" @close="editing = null">
      <form @submit.prevent="saveEdit">
        <AdminArtworkFieldsForm v-model="form" id-prefix="edit" />
        <label class="khw-publish">
          <input v-model="published" type="checkbox" />
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
    </AdminDialog>

    <AdminDialog v-if="adding" title="Add an artwork" @close="adding = false">
      <form @submit.prevent="saveAdd">
        <AdminImagePicker v-model="addFile" id="add-image" class="khw-picker" />
        <AdminArtworkFieldsForm v-model="addForm" id-prefix="add" />
        <p v-if="addError" class="kha-error">{{ addError }}</p>
        <div class="khw-dialog-actions">
          <button type="button" class="kha-btn kha-btn--ghost" @click="adding = false">Cancel</button>
          <button type="submit" class="kha-btn" :disabled="addSaving">
            {{ addSaving ? 'Uploading…' : 'Add and publish' }}
          </button>
        </div>
      </form>
    </AdminDialog>
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
.khw-picker {
  margin-bottom: 20px;
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
  .khw-upload {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
