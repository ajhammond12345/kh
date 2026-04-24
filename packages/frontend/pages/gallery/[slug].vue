<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Back link -->
    <NuxtLink
      to="/gallery"
      class="inline-flex items-center gap-1 font-serif text-gallery-gold hover:text-gallery-bronze transition-colors mb-8"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Gallery
    </NuxtLink>

    <div v-if="artwork" class="md:flex gap-8">
      <!-- Image -->
      <div class="md:w-1/2 mb-6 md:mb-0">
        <div
          class="rounded-lg overflow-hidden cursor-pointer shadow-md"
          :style="{ backgroundColor: artwork.dominantColor || '#EDE0C7' }"
          @click="lightboxOpen = true"
        >
          <img
            v-if="artwork.imagePath"
            :src="imageUrl(artwork.imagePath, 'large')"
            :alt="artwork.title"
            class="w-full h-auto"
          />
        </div>
        <p class="font-serif text-xs text-charcoal-700 mt-2 text-center">
          Click image to view full size
        </p>
      </div>

      <!-- Details -->
      <div class="md:w-1/2">
        <h1 class="font-display text-3xl md:text-4xl text-charcoal-900 mb-4">
          {{ artwork.title }}
        </h1>

        <div class="space-y-2 mb-6">
          <p v-if="artwork.location" class="font-serif text-charcoal-700">
            <span class="font-semibold text-charcoal-900">Location:</span> {{ artwork.location }}
          </p>
          <p v-if="artwork.subject" class="font-serif text-charcoal-700">
            <span class="font-semibold text-charcoal-900">Subject:</span> {{ artwork.subject }}
          </p>
          <p v-if="artwork.medium" class="font-serif text-charcoal-700">
            <span class="font-semibold text-charcoal-900">Medium:</span> {{ artwork.medium }}
          </p>
          <p v-if="artwork.decade" class="font-serif text-charcoal-700">
            <span class="font-semibold text-charcoal-900">Date:</span> {{ artwork.decade }}
          </p>
          <p v-if="artwork.signature" class="font-serif text-charcoal-700">
            <span class="font-semibold text-charcoal-900">Signature:</span> {{ artwork.signature }}
          </p>
          <p v-if="artwork.dimensions" class="font-serif text-charcoal-700">
            <span class="font-semibold text-charcoal-900">Dimensions:</span> {{ artwork.dimensions }}
          </p>
        </div>

        <div v-if="artwork.description" class="prose-gallery">
          <p>{{ artwork.description }}</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="text-center py-16">
      <p class="font-serif text-charcoal-700">Loading artwork...</p>
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-16">
      <h1 class="font-display text-3xl text-charcoal-900 mb-4">Artwork Not Found</h1>
      <NuxtLink to="/gallery" class="font-serif text-gallery-gold hover:text-gallery-bronze transition-colors">
        Return to Gallery
      </NuxtLink>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen && artwork?.imagePath"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        @click="lightboxOpen = false"
      >
        <button
          class="absolute top-4 right-4 text-white/70 hover:text-white text-3xl"
          @click="lightboxOpen = false"
        >
          &times;
        </button>
        <img
          :src="imageUrl(artwork.imagePath, 'large')"
          :alt="artwork.title"
          class="max-w-full max-h-[90vh] object-contain"
          @click.stop
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Artwork } from '~/composables/useGallery'

const route = useRoute()
const { fetchArtwork, imageUrl } = useGallery()

const artwork = ref<Artwork | null>(null)
const loading = ref(true)
const lightboxOpen = ref(false)

onMounted(async () => {
  const slug = route.params.slug as string
  artwork.value = await fetchArtwork(slug)
  loading.value = false

  if (artwork.value) {
    useHead({ title: `${artwork.value.title} — Knighton-Hammond` })
  }
})
</script>
