<script setup lang="ts">
const route = useRoute()
const { artworks } = useArtworks()

const slug = route.params.slug as string
const work = artworks.find((w) => w.id === slug) || null
const lightboxOpen = ref(false)

if (work) {
  useHead({ title: `${work.title} — Knighton-Hammond` })
} else {
  useHead({ title: 'Artwork Not Found — Knighton-Hammond' })
}
</script>

<template>
  <div :style="{ maxWidth: '960px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <NuxtLink
      to="/#library"
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-ui)',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--sienna)',
        textDecoration: 'none',
        letterSpacing: '0.02em',
        marginBottom: '40px',
      }"
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Library
    </NuxtLink>

    <div v-if="work" class="kh-detail">
      <div class="kh-detail-image">
        <div
          :style="{ background: 'var(--paper-2)', padding: '16px', cursor: work.image ? 'pointer' : 'default' }"
          @click="work.image && (lightboxOpen = true)"
        >
          <GalleryArtworkImage :work="work" frame="bare" ratio="auto" />
        </div>
        <div
          v-if="work.image"
          :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center', marginTop: '8px' }"
        >
          Click image to view full size
        </div>
      </div>

      <div class="kh-detail-info">
        <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 500, lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 24px' }">
          {{ work.title }}
        </h1>

        <div class="kh-meta">
          <div v-if="work.year" class="kh-meta-row">
            <span class="kh-meta-label">Date</span>
            <span class="kh-meta-value">{{ work.year }}</span>
          </div>
          <div v-if="work.medium" class="kh-meta-row">
            <span class="kh-meta-label">Medium</span>
            <span class="kh-meta-value">{{ work.medium }}</span>
          </div>
          <div v-if="work.dim" class="kh-meta-row">
            <span class="kh-meta-label">Dimensions</span>
            <span class="kh-meta-value">{{ work.dim }}</span>
          </div>
          <div v-if="work.subject" class="kh-meta-row">
            <span class="kh-meta-label">Subject</span>
            <span class="kh-meta-value">{{ work.subject }}</span>
          </div>
          <div v-if="work.location" class="kh-meta-row">
            <span class="kh-meta-label">Location</span>
            <span class="kh-meta-value">{{ work.location }}</span>
          </div>
          <div v-if="work.signature" class="kh-meta-row">
            <span class="kh-meta-label">Signature</span>
            <span class="kh-meta-value">{{ work.signature }}</span>
          </div>
        </div>

        <p
          v-if="work.blurb"
          :style="{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            lineHeight: 1.65,
            color: 'var(--ink-2)',
            marginTop: '28px',
            maxWidth: '50ch',
          }"
        >
          {{ work.blurb }}
        </p>
      </div>
    </div>

    <div
      v-else
      :style="{ textAlign: 'center', padding: '96px 0' }"
    >
      <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--ink)', marginBottom: '16px' }">
        Artwork Not Found
      </h1>
      <NuxtLink
        to="/#library"
        :style="{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--sienna)', textDecoration: 'none' }"
      >
        Return to Library
      </NuxtLink>
    </div>

    <Teleport to="body">
      <Transition name="kh-lightbox">
        <div
          v-if="lightboxOpen && work?.image"
          :style="{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'pointer',
          }"
          @click="lightboxOpen = false"
        >
          <button
            :style="{
              position: 'absolute',
              top: '16px',
              right: '20px',
              background: 'transparent',
              border: 0,
              color: 'rgba(255,255,255,0.7)',
              fontSize: '32px',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }"
            @click="lightboxOpen = false"
          >
            &times;
          </button>
          <img
            :src="work.image"
            :alt="work.title"
            :style="{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }"
            @click.stop
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.kh-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
@media (max-width: 720px) {
  .kh-detail {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
.kh-meta {
  display: flex;
  flex-direction: column;
}
.kh-meta-row {
  display: flex;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--hairline);
  font-family: var(--font-body);
  font-size: 15px;
}
.kh-meta-row:first-child {
  border-top: 1px solid var(--hairline);
}
.kh-meta-label {
  flex-shrink: 0;
  width: 100px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding-top: 2px;
}
.kh-meta-value {
  color: var(--ink-2);
}
.kh-lightbox-enter-active,
.kh-lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.kh-lightbox-enter-from,
.kh-lightbox-leave-to {
  opacity: 0;
}
</style>
