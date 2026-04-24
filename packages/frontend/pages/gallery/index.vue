<template>
  <div class="max-w-gallery mx-auto px-4 py-12">
    <h1 class="font-display text-4xl md:text-5xl text-charcoal-900 mb-2 text-center">
      Photo Gallery
    </h1>
    <p class="font-serif text-charcoal-700 text-center mb-8">
      Browse the collection of Arthur Henry Knighton-Hammond's work
    </p>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 justify-center mb-8">
      <input
        v-model="search"
        type="text"
        placeholder="Search artworks by title..."
        class="px-4 py-2 rounded-lg border border-cream-200 bg-white font-serif text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
        @keyup.enter="loadArtworks()"
      />
      <select
        v-model="filters.subject"
        class="px-3 py-2 rounded-lg border border-cream-200 bg-white font-serif text-sm focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
        @change="loadArtworks()"
      >
        <option value="">All Subjects</option>
        <option v-for="s in filterOptions.subjects" :key="s" :value="s">{{ s }}</option>
      </select>
      <select
        v-model="filters.medium"
        class="px-3 py-2 rounded-lg border border-cream-200 bg-white font-serif text-sm focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
        @change="loadArtworks()"
      >
        <option value="">All Media</option>
        <option v-for="m in filterOptions.media" :key="m" :value="m">{{ m }}</option>
      </select>
      <select
        v-model="filters.decade"
        class="px-3 py-2 rounded-lg border border-cream-200 bg-white font-serif text-sm focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
        @change="loadArtworks()"
      >
        <option value="">All Decades</option>
        <option v-for="d in filterOptions.decades" :key="d" :value="d">{{ d }}</option>
      </select>
    </div>

    <!-- Result count -->
    <p v-if="totalCount !== null" class="font-serif text-sm text-charcoal-700 text-center mb-6">
      Showing {{ artworks.length ? page * limit + 1 : 0 }} to {{ page * limit + artworks.length }}
      of {{ totalCount }} artwork{{ totalCount !== 1 ? 's' : '' }}
    </p>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <NuxtLink
        v-for="artwork in artworks"
        :key="artwork.id"
        :to="`/gallery/${artwork.slug}`"
        class="bg-cream-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
      >
        <div
          class="aspect-[4/3] overflow-hidden flex items-center justify-center"
          :style="{ backgroundColor: artwork.dominantColor || '#EDE0C7' }"
        >
          <img
            v-if="artwork.imagePath"
            :src="imageUrl(artwork.imagePath, 'thumb')"
            :alt="artwork.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div class="p-3">
          <h3 class="font-serif font-medium text-charcoal-900 text-sm line-clamp-2">
            {{ artwork.title }}
          </h3>
          <p class="font-serif text-xs text-charcoal-700 mt-1">
            <span v-if="artwork.medium">{{ artwork.medium }}</span>
            <span v-if="artwork.medium && artwork.decade"> &middot; </span>
            <span v-if="artwork.decade">{{ artwork.decade }}</span>
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-if="artworks.length === 0 && !loading" class="text-center py-16">
      <p class="font-serif text-charcoal-700">No artworks found matching your criteria.</p>
      <button
        class="mt-4 font-serif text-gallery-gold hover:text-gallery-bronze transition-colors"
        @click="clearFilters"
      >
        Clear all filters
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <p class="font-serif text-charcoal-700">Loading artworks...</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalCount && totalCount > limit" class="flex justify-center gap-4 mt-10">
      <button
        :disabled="page === 0"
        class="px-5 py-2 font-serif text-sm border border-cream-200 rounded hover:bg-cream-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        @click="prevPage"
      >
        &larr; Previous
      </button>
      <span class="font-serif text-sm text-charcoal-700 py-2">
        Page {{ page + 1 }} of {{ Math.ceil(totalCount / limit) }}
      </span>
      <button
        :disabled="(page + 1) * limit >= totalCount"
        class="px-5 py-2 font-serif text-sm border border-cream-200 rounded hover:bg-cream-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        @click="nextPage"
      >
        Next &rarr;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Artwork, FilterOptions } from '~/composables/useGallery'

useHead({ title: 'Photo Gallery — The Knighton-Hammond Charitable Trust' })

const { fetchArtworks, fetchFilters, imageUrl } = useGallery()

const search = ref('')
const filters = reactive({ subject: '', medium: '', decade: '' })
const artworks = ref<Artwork[]>([])
const totalCount = ref<number | null>(null)
const page = ref(0)
const limit = 24
const loading = ref(false)

const filterOptions = ref<FilterOptions>({ subjects: [], media: [], decades: [], locations: [] })

async function loadArtworks() {
  loading.value = true
  try {
    const result = await fetchArtworks({
      search: search.value || undefined,
      subject: filters.subject || undefined,
      medium: filters.medium || undefined,
      decade: filters.decade || undefined,
      page: page.value,
      limit,
    })
    artworks.value = result.artworks
    totalCount.value = result.totalCount
  } catch (e) {
    console.error('Failed to load artworks:', e)
  } finally {
    loading.value = false
  }
}

function prevPage() {
  if (page.value > 0) {
    page.value--
    loadArtworks()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  if (totalCount.value && (page.value + 1) * limit < totalCount.value) {
    page.value++
    loadArtworks()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function clearFilters() {
  search.value = ''
  filters.subject = ''
  filters.medium = ''
  filters.decade = ''
  page.value = 0
  loadArtworks()
}

onMounted(async () => {
  const [_, filtersData] = await Promise.all([
    loadArtworks(),
    fetchFilters(),
  ])
  filterOptions.value = filtersData
})
</script>
