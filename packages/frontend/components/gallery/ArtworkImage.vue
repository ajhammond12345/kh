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

// Prefer the self-hosted image; fall back to the original source once if it
// hasn't been imported to disk yet.
const src = ref(imageUrl(props.work.id, props.size) || props.work.image)

function onError() {
  if (props.work.image && src.value !== props.work.image) src.value = props.work.image
}

const innerStyle = computed(() => ({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  aspectRatio: props.ratio,
}))

const wrapperStyle = computed(() => {
  if (props.frame === 'bare') return undefined
  return {
    background: 'var(--paper-2)',
    padding: props.frame === 'deep' ? '22px' : '14px',
    boxShadow: props.frame === 'deep' ? 'var(--shadow-3)' : 'none',
  }
})
</script>

<template>
  <div v-if="frame !== 'bare'" :style="wrapperStyle">
    <img
      :src="src"
      :alt="work.title"
      :loading="lazy ? 'lazy' : undefined"
      :style="innerStyle"
      @error="onError"
    />
  </div>
  <img
    v-else
    :src="src"
    :alt="work.title"
    :loading="lazy ? 'lazy' : undefined"
    :style="innerStyle"
    @error="onError"
  />
</template>
