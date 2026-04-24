<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Content Editor</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Page list -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 class="text-sm font-medium text-gray-700 mb-3">Pages</h2>
        <ul class="space-y-1">
          <li v-for="page in pages" :key="page.slug">
            <button
              class="w-full text-left px-3 py-2 rounded text-sm transition-colors"
              :class="selectedPage === page.slug ? 'bg-gallery-gold/10 text-gallery-gold font-medium' : 'text-gray-700 hover:bg-gray-100'"
              @click="selectPage(page.slug)"
            >
              {{ page.title }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Editor -->
      <div class="md:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div v-if="selectedPage">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input
              v-model="editTitle"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
            <textarea
              v-model="editContent"
              rows="20"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
            />
          </div>
          <div class="flex gap-3">
            <button
              class="px-6 py-2 bg-charcoal-900 text-white rounded hover:bg-charcoal-800 transition-colors text-sm disabled:opacity-50"
              :disabled="saving"
              @click="saveContent"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
            <span v-if="saveMessage" class="text-sm text-green-600 py-2">{{ saveMessage }}</span>
          </div>
        </div>
        <div v-else class="text-center py-16 text-gray-500 text-sm">
          Select a page from the left to edit its content.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()

const pages = [
  { slug: 'about', title: 'About Us' },
  { slug: 'artist', title: 'The Artist' },
  { slug: 'gallery-project', title: 'Gallery Project' },
  { slug: 'media', title: "Artist's Media" },
  { slug: 'privacy', title: 'Privacy Policy' },
]

const selectedPage = ref('')
const editTitle = ref('')
const editContent = ref('')
const saving = ref(false)
const saveMessage = ref('')

async function selectPage(slug: string) {
  selectedPage.value = slug
  saveMessage.value = ''
  try {
    const res = await fetch(`${config.public.apiBase}/api/admin/content/${slug}`, {
      credentials: 'include',
    })
    if (res.ok) {
      const data = await res.json()
      editTitle.value = data.title
      editContent.value = data.content
    } else {
      const page = pages.find(p => p.slug === slug)
      editTitle.value = page?.title || ''
      editContent.value = ''
    }
  } catch {
    editTitle.value = ''
    editContent.value = ''
  }
}

async function saveContent() {
  saving.value = true
  saveMessage.value = ''
  try {
    await fetch(`${config.public.apiBase}/api/admin/content/${selectedPage.value}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle.value, content: editContent.value }),
    })
    saveMessage.value = 'Saved successfully'
  } catch {
    saveMessage.value = 'Failed to save'
  } finally {
    saving.value = false
  }
}
</script>
