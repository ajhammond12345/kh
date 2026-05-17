<script setup lang="ts">
import type { GalleryArtwork } from '~/composables/useArtworks'

const { artworks } = useArtworks()

// Prefer real photographic plates first, then a couple of generated landscapes.
const list = computed<GalleryArtwork[]>(() => {
  const published = artworks.filter((w) => w.status === 'published')
  const reals = published.filter((w) => w.image)
  const generated = published.filter(
    (w) => !w.image && ['open-valley', 'river-bend', 'sea', 'venice-canal'].includes(w.layout || ''),
  )
  return [...reals, ...generated].slice(0, 5)
})

const idx = ref(0)
const current = computed(() => list.value[idx.value] || list.value[0])

const heroEl = ref<HTMLElement | null>(null)

function syncHeaderHeight() {
  const header = document.querySelector('[data-screen-label="Header"]')
  if (header && heroEl.value) {
    heroEl.value.style.setProperty('--header-h', `${header.getBoundingClientRect().height}px`)
  }
}

let timer: ReturnType<typeof setInterval> | null = null
let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  timer = setInterval(() => {
    idx.value = (idx.value + 1) % Math.max(1, list.value.length)
  }, 7800)
  syncHeaderHeight()
  const header = document.querySelector('[data-screen-label="Header"]')
  if (header) {
    resizeObserver = new ResizeObserver(syncHeaderHeight)
    resizeObserver.observe(header)
  }
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <section
    ref="heroEl"
    data-screen-label="Hero"
    class="kh-hero"
  >
    <!-- Painting layer -->
    <div :style="{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }">
      <div
        v-for="(it, i) in list"
        :key="it.id"
        :aria-hidden="i !== idx"
        :style="{
          position: 'absolute',
          inset: 0,
          opacity: i === idx ? 1 : 0,
          transition: 'opacity 1400ms cubic-bezier(0.22,0.61,0.36,1)',
        }"
      >
        <div class="kh-kenburns" :style="{ width: '100%', height: '100%' }">
          <GalleryArtworkImage
            :work="it"
            frame="bare"
            ratio="auto"
          />
        </div>
      </div>
      <!-- Tonal scrims for type legibility -->
      <div
        :style="{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgb(22 26 34 / 0.56) 0%, rgb(22 26 34 / 0.18) 32%, rgb(22 26 34 / 0.18) 60%, rgb(22 26 34 / 0.78) 100%)',
        }"
      />
      <div
        :style="{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 22% 78%, rgb(22 26 34 / 0.45) 0%, transparent 55%)',
        }"
      />
    </div>

    <!-- Type layer -->
    <div
      :style="{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1320px',
        margin: '0 auto',
        padding: 'min(14vh, 18vh) 32px 0',
        color: '#FAF6EC',
      }"
    >
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--font-ui)',
          fontSize: '11px',
          letterSpacing: '0.20em',
          fontWeight: 600,
          color: 'rgb(250 246 236 / 0.78)',
          marginBottom: '32px',
          textTransform: 'uppercase',
        }"
      >
        <span :style="{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--sienna)' }" />
        1875 — 1970 · KNIGHTON HAMMOND CHARITABLE TRUST
      </div>
      <h1
        :style="{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(54px, 8vw, 124px)',
          lineHeight: 0.96,
          letterSpacing: '-0.018em',
          color: '#FAF6EC',
          margin: '0 0 24px',
          fontWeight: 500,
          maxWidth: '16ch',
          textShadow: '0 2px 22px rgb(0 0 0 / 0.18)',
        }"
      >
        The artwork library
        <br />
        <em :style="{ fontWeight: 400, color: '#F1E0CC' }">of an English master.</em>
      </h1>
      <p
        :style="{
          fontFamily: 'var(--font-body)',
          fontSize: '19px',
          lineHeight: 1.55,
          color: 'rgb(250 246 236 / 0.84)',
          margin: '0 0 40px',
          maxWidth: '48ch',
          textShadow: '0 1px 8px rgb(0 0 0 / 0.18)',
        }"
      >
        Forty-eight years of letters, sketchbooks, society portraits and
        watercolours by Arthur Henry Knighton-Hammond — assembled as a single
        public catalogue, searchable to the last work.
      </p>
      <div :style="{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }">
        <NuxtLink
          to="/gallery"
          :style="{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#FAF6EC',
            background: 'var(--sienna)',
            border: 0,
            borderRadius: '2px',
            padding: '15px 28px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
          }"
        >
          Enter the library
        </NuxtLink>
        <NuxtLink
          to="/artist"
          :style="{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: '#FAF6EC',
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            padding: '15px 4px',
            textDecoration: 'none',
          }"
        >
          About the artist →
        </NuxtLink>
      </div>
    </div>

    <!-- Caption + dot rail -->
    <div
      :style="{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        padding: '20px 32px',
      }"
    >
      <div
        :style="{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }"
      >
        <div :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
          <button
            v-for="(_, i) in list"
            :key="i"
            :aria-label="`View ${i + 1} of ${list.length}`"
            @click="idx = i"
            :style="{
              height: '2px',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              transition: 'all 320ms cubic-bezier(0.22,0.61,0.36,1)',
              width: i === idx ? '28px' : '14px',
              background: i === idx ? '#FAF6EC' : 'rgb(250 246 236 / 0.45)',
            }"
          />
        </div>
        <div
          v-if="current"
          :style="{ fontFamily: 'var(--font-ui)', fontSize: '12px', letterSpacing: '0.02em' }"
        >
          <span :style="{ fontStyle: 'italic', color: '#FAF6EC' }">{{ current.title }}</span>
          <span :style="{ color: 'rgb(250 246 236 / 0.65)', paddingLeft: '14px' }">
            {{ current.year }} · {{ current.medium }} · {{ current.dim }} · {{ current.location }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.kh-hero {
  --header-h: 65px;
  position: relative;
  height: 100vh;
  min-height: 720px;
  width: 100%;
  overflow: hidden;
  background: var(--prussian-2);
  margin-top: calc(-1 * var(--header-h));
  padding-top: var(--header-h);
}
section :deep(.kh-kenburns img) {
  object-fit: cover;
  object-position: top center;
  width: 100%;
  height: 100%;
}
</style>
