<script setup lang="ts">
import type { GalleryArtwork } from '~/composables/useArtworks'

useHead({
  title: 'Artwork Library — Knighton-Hammond Charitable Trust',
  meta: [
    {
      name: 'description',
      content:
        'A public catalogue of every Knighton-Hammond painting the Trust has been able to find — searchable, with provenance, captions, and the stories behind them.',
    },
  ],
})

const { artworks } = useArtworks()
const all = computed<GalleryArtwork[]>(() => artworks.filter((w) => w.status === 'published'))

const libraryFilter = ref('')
const libraryFiltered = computed<GalleryArtwork[]>(() => {
  const needle = libraryFilter.value.trim().toLowerCase()
  if (!needle) return all.value
  return all.value.filter(
    (w) =>
      w.title.toLowerCase().includes(needle) ||
      (w.subject || '').toLowerCase().includes(needle) ||
      (w.location || '').toLowerCase().includes(needle) ||
      (w.year || '').toLowerCase().includes(needle) ||
      (w.medium || '').toLowerCase().includes(needle) ||
      (w.tags || []).some((t) => t.toLowerCase().includes(needle)),
  )
})
</script>

<template>
  <div :style="{ maxWidth: '1320px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      THE CATALOGUE SO FAR
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 40px' }">
      {{ all.length }} works catalogued
    </h1>

    <div :style="{ marginBottom: '32px' }">
      <input
        v-model="libraryFilter"
        type="text"
        placeholder="Filter by title, subject, location, year…"
        class="kh-filter-input"
      />
    </div>

    <div
      :style="{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px',
      }"
    >
      <NuxtLink
        v-for="w in libraryFiltered"
        :key="w.id"
        :to="`/gallery/${w.id}`"
        class="kh-plate"
        :style="{
          background: 'transparent',
          border: 0,
          padding: 0,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit',
        }"
      >
        <div :style="{ background: 'var(--paper-2)', padding: '10px' }">
          <GalleryArtworkImage :work="w" frame="bare" ratio="4 / 5" />
        </div>
        <div :style="{ padding: '10px 4px' }">
          <div :style="{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--ink)' }">
            <em>{{ w.title }}</em>
          </div>
          <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-2)', marginTop: '4px' }">
            {{ w.year }} · {{ w.medium }}
          </div>
        </div>
      </NuxtLink>
    </div>

    <div
      v-if="libraryFilter && libraryFiltered.length === 0"
      :style="{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink-2)', padding: '48px 0', textAlign: 'center' }"
    >
      No artworks match "{{ libraryFilter }}".
    </div>
  </div>
</template>

<style scoped>
.kh-filter-input {
  width: 100%;
  max-width: 480px;
  padding: 10px 16px 10px 40px;
  font-family: var(--font-ui);
  font-size: 14px;
  color: var(--ink);
  background: var(--paper-2);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7180' stroke-width='1.7' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
}
</style>
