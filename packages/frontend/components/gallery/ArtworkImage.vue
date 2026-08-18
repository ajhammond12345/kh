<script setup lang="ts">
import type { GalleryArtwork } from '~/composables/useArtworks'

const props = withDefaults(defineProps<{
  work: GalleryArtwork
  frame?: 'plate' | 'bare' | 'deep'
  ratio?: string
  lazy?: boolean
  size?: 'thumb' | 'medium' | 'large'
}>(), {
  frame: 'plate',
  ratio: '4 / 5',
  lazy: true,
  size: 'medium',
})

const { imageUrl } = useGallery()

const failed = ref(false)
watch(() => props.work.id, () => { failed.value = false })

const placeholder = computed(() => props.work.dominantColor || 'var(--parchment)')

const pictureStyle = computed(() => ({
  display: 'block',
  width: '100%',
  height: '100%',
  background: placeholder.value,
}))

const innerStyle = computed(() => ({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  aspectRatio: props.ratio,
}))

const fallbackStyle = computed(() => ({
  width: '100%',
  height: '100%',
  aspectRatio: props.ratio === 'auto' ? '4 / 5' : props.ratio,
  background: placeholder.value,
}))

const wrapperStyle = computed(() => {
  if (props.frame === 'bare') return { width: '100%', height: '100%' }
  return {
    background: 'var(--paper-2)',
    padding: props.frame === 'deep' ? '22px' : '14px',
    boxShadow: props.frame === 'deep' ? 'var(--shadow-3)' : 'none',
  }
})
</script>

<template>
  <div :style="wrapperStyle">
    <picture v-if="!failed" :style="pictureStyle">
      <source type="image/webp" :srcset="imageUrl(work.id, size, 'webp')" />
      <img
        :src="imageUrl(work.id, size, 'jpg')"
        :alt="work.title"
        :loading="lazy ? 'lazy' : undefined"
        :style="innerStyle"
        @error="failed = true"
      />
    </picture>
    <div v-else role="img" :aria-label="work.title" :style="fallbackStyle" />
  </div>
</template>
