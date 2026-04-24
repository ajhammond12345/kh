<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Gallery Management</h1>
      <button
        class="px-4 py-2 bg-gallery-gold text-white rounded hover:bg-gallery-bronze transition-colors text-sm"
        @click="showUpload = !showUpload"
      >
        {{ showUpload ? 'Cancel' : '+ Upload Artwork' }}
      </button>
    </div>

    <!-- Upload Form -->
    <div v-if="showUpload" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Upload New Artwork</h2>
      <form @submit.prevent="uploadArtwork">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              v-model="uploadForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image *</label>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/tiff"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              @change="onFileChange"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Medium</label>
            <select v-model="uploadForm.medium" class="w-full px-3 py-2 border border-gray-300 rounded text-sm">
              <option value="">Select...</option>
              <option v-for="m in mediaOptions" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select v-model="uploadForm.subject" class="w-full px-3 py-2 border border-gray-300 rounded text-sm">
              <option value="">Select...</option>
              <option v-for="s in subjectOptions" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Decade</label>
            <select v-model="uploadForm.decade" class="w-full px-3 py-2 border border-gray-300 rounded text-sm">
              <option value="">Select...</option>
              <option v-for="d in decadeOptions" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              v-model="uploadForm.location"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Signature</label>
            <input
              v-model="uploadForm.signature"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
            <input
              v-model="uploadForm.dimensions"
              type="text"
              placeholder="e.g. 27 cm x 37 cm"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="uploadForm.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <p v-if="uploadError" class="text-red-600 text-sm mb-3">{{ uploadError }}</p>
        <button
          type="submit"
          :disabled="uploading"
          class="px-6 py-2 bg-charcoal-900 text-white rounded hover:bg-charcoal-800 transition-colors text-sm disabled:opacity-50"
        >
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </form>
    </div>

    <!-- Artwork List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-gray-700">Image</th>
            <th class="text-left px-4 py-3 font-medium text-gray-700">Title</th>
            <th class="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">Medium</th>
            <th class="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">Subject</th>
            <th class="text-left px-4 py-3 font-medium text-gray-700 hidden lg:table-cell">Decade</th>
            <th class="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="artwork in artworks"
            :key="artwork.id"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <td class="px-4 py-2">
              <div class="w-16 h-12 rounded overflow-hidden bg-gray-200">
                <img
                  v-if="artwork.imagePath"
                  :src="imageUrl(artwork.imagePath, 'thumb')"
                  :alt="artwork.title"
                  class="w-full h-full object-cover"
                />
              </div>
            </td>
            <td class="px-4 py-2 font-medium text-gray-900">{{ artwork.title }}</td>
            <td class="px-4 py-2 text-gray-600 hidden md:table-cell">{{ artwork.medium || '—' }}</td>
            <td class="px-4 py-2 text-gray-600 hidden md:table-cell">{{ artwork.subject || '—' }}</td>
            <td class="px-4 py-2 text-gray-600 hidden lg:table-cell">{{ artwork.decade || '—' }}</td>
            <td class="px-4 py-2 text-right">
              <button
                class="text-red-600 hover:text-red-800 text-xs"
                @click="deleteArtwork(artwork.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="artworks.length === 0" class="p-8 text-center text-gray-500 text-sm">
        No artworks yet. Upload your first artwork above.
      </div>

      <!-- Pagination -->
      <div v-if="totalCount > limit" class="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
        <span class="text-sm text-gray-600">
          {{ page * limit + 1 }}–{{ Math.min((page + 1) * limit, totalCount) }} of {{ totalCount }}
        </span>
        <div class="flex gap-2">
          <button
            :disabled="page === 0"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-30"
            @click="page--; loadArtworks()"
          >
            Prev
          </button>
          <button
            :disabled="(page + 1) * limit >= totalCount"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-30"
            @click="page++; loadArtworks()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Artwork } from '~/composables/useGallery'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const { fetchArtworks, imageUrl } = useGallery()

const showUpload = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)

const artworks = ref<Artwork[]>([])
const totalCount = ref(0)
const page = ref(0)
const limit = 50

const uploadForm = reactive({
  title: '',
  medium: '',
  subject: '',
  decade: '',
  location: '',
  signature: '',
  dimensions: '',
  description: '',
})

const mediaOptions = ['Oils', 'Watercolour', 'Pastel', 'Drawing', 'Etching', 'Postcard', 'Print']
const subjectOptions = [
  'Landscape', 'Streetscape', 'Cityscape', 'Portrait', 'Still Life',
  'Flower Study', 'Coastal Scene', 'Boating Scene', 'Church',
  'Sporting Scene', 'Hunting Scene', 'Interior Scene', 'Cloud Study',
  'Family Gathering', 'Conversation Piece', 'Industrial Scene', 'Motoring Scene',
]
const decadeOptions = ['1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s']

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

async function uploadArtwork() {
  if (!selectedFile.value || !uploadForm.title) return
  uploading.value = true
  uploadError.value = ''

  const formData = new FormData()
  formData.append('image', selectedFile.value)
  for (const [key, value] of Object.entries(uploadForm)) {
    if (value) formData.append(key, value)
  }

  try {
    const res = await fetch(`${config.public.apiBase}/api/admin/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    if (!res.ok) {
      const data = await res.json()
      uploadError.value = data.error || 'Upload failed'
      return
    }
    showUpload.value = false
    Object.assign(uploadForm, { title: '', medium: '', subject: '', decade: '', location: '', signature: '', dimensions: '', description: '' })
    selectedFile.value = null
    await loadArtworks()
  } catch {
    uploadError.value = 'Connection error'
  } finally {
    uploading.value = false
  }
}

async function deleteArtwork(id: number) {
  if (!confirm('Delete this artwork?')) return
  await fetch(`${config.public.apiBase}/api/admin/artwork/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  await loadArtworks()
}

async function loadArtworks() {
  const result = await fetchArtworks({ page: page.value, limit })
  artworks.value = result.artworks
  totalCount.value = result.totalCount
}

onMounted(loadArtworks)
</script>
