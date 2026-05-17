<script setup lang="ts">
import type { GalleryArtwork } from '~/composables/useArtworks'

const props = withDefaults(defineProps<{
  work: GalleryArtwork
  frame?: 'plate' | 'bare' | 'deep'
  ratio?: string
  lazy?: boolean
}>(), {
  frame: 'plate',
  ratio: '4 / 5',
  lazy: true,
})

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
      :src="work.image"
      :alt="work.title"
      :loading="lazy ? 'lazy' : undefined"
      :style="innerStyle"
    />
  </div>
  <img
    v-else
    :src="work.image"
    :alt="work.title"
    :loading="lazy ? 'lazy' : undefined"
    :style="innerStyle"
  />
</template>
