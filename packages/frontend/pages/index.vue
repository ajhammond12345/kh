<script setup lang="ts">
import type { GalleryArtwork } from '~/composables/useArtworks'

useHead({
  title: 'Knighton Hammond Charitable Trust — The artwork library',
  meta: [
    {
      name: 'description',
      content:
        'A public catalogue of every Knighton-Hammond painting the Trust has been able to find — searchable, with provenance, captions, and the stories behind them.',
    },
  ],
})

const { artworks, journal } = useArtworks()
const all = computed<GalleryArtwork[]>(() => artworks.filter((w) => w.status === 'published'))
const featured = computed<GalleryArtwork[]>(() => all.value.slice(0, 6))

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

const sectionStyle = {
  maxWidth: '1320px',
  margin: '96px auto 0',
  padding: '0 32px',
}
const headStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  marginBottom: '40px',
  gap: '24px',
}
const eyebrowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontFamily: 'var(--font-ui)',
  fontSize: '11px',
  letterSpacing: '0.20em',
  fontWeight: 600,
  color: 'var(--ink-3)',
  marginBottom: '16px',
  textTransform: 'uppercase' as const,
}
const ruleStyle = {
  display: 'inline-block',
  width: '24px',
  height: '1px',
  background: 'var(--sienna)',
}
const h3Style = {
  fontFamily: 'var(--font-display)',
  fontSize: '44px',
  fontWeight: 500,
  lineHeight: 1.05,
  margin: 0,
  letterSpacing: '-0.01em',
  color: 'var(--ink)',
}
const viewAllStyle = {
  background: 'transparent',
  border: 0,
  padding: '8px 0',
  fontFamily: 'var(--font-ui)',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--sienna)',
  cursor: 'pointer',
  letterSpacing: '0.02em',
  textDecoration: 'none',
}
</script>

<template>
  <div>
    <GalleryHero />

    <!-- Stat strip -->
    <section :style="{ background: 'var(--ink)', color: '#FAF6EC', padding: '32px' }">
      <div
        :style="{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }"
      >
        <div
          v-for="(s, i) in [
            { n: all.length, k: 'works catalogued' },
            { n: '48', k: 'years of practice' },
            { n: '9', k: 'countries painted' },
            { n: '3', k: 'major collections' },
          ]"
          :key="i"
          :style="{
            display: 'flex',
            alignItems: 'baseline',
            gap: '14px',
            paddingLeft: '24px',
            borderLeft: '1px solid rgb(250 246 236 / 0.18)',
          }"
        >
          <div :style="{ fontFamily: 'var(--font-display)', fontSize: '44px', color: '#F1E0CC', fontWeight: 500 }">
            {{ s.n }}
          </div>
          <div
            :style="{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgb(250 246 236 / 0.7)',
              fontWeight: 600,
            }"
          >
            {{ s.k }}
          </div>
        </div>
      </div>
    </section>

    <!-- Featured -->
    <section :style="sectionStyle">
      <div :style="headStyle">
        <div>
          <div :style="eyebrowStyle"><span :style="ruleStyle" />FROM THE LIBRARY</div>
          <h3 :style="h3Style">Recently catalogued</h3>
        </div>
        <a href="#library" :style="viewAllStyle">
          Browse all {{ all.length }} works →
        </a>
      </div>
      <div
        :style="{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: 'minmax(280px, auto)',
          gap: '28px',
        }"
      >
        <NuxtLink
          v-for="(w, i) in featured"
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
            gridColumn: i === 0 ? 'span 2' : 'span 1',
            gridRow: i === 0 ? 'span 2' : 'span 1',
          }"
        >
          <div :style="{ background: 'var(--paper-2)', padding: i === 0 ? '18px' : '12px' }">
            <GalleryArtworkImage
              :work="w"
              frame="bare"
              ratio="auto"
            />
          </div>
          <div :style="{ padding: '12px 4px' }">
            <div
              :style="{
                fontFamily: 'var(--font-display)',
                fontSize: i === 0 ? '24px' : '17px',
                color: 'var(--ink)',
              }"
            >
              <em>{{ w.title }}</em>
            </div>
            <div
              :style="{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                color: 'var(--ink-2)',
                marginTop: '4px',
              }"
            >
              {{ w.year }} · {{ w.medium }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- About + quote -->
    <section
      :style="{
        background: 'var(--paper-2)',
        marginTop: '96px',
        padding: '96px 32px',
        maxWidth: 'none',
      }"
    >
      <div
        :style="{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '96px',
          alignItems: 'center',
        }"
      >
        <div>
          <div :style="eyebrowStyle"><span :style="ruleStyle" />OUR PURPOSE</div>
          <h3 :style="{ ...h3Style, fontSize: '52px' }">
            Conserving<br /><em>a quiet legacy.</em>
          </h3>
          <p
            :style="{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              lineHeight: 1.65,
              color: 'var(--ink-2)',
              margin: '0 0 28px',
              maxWidth: '52ch',
            }"
          >
            Knighton-Hammond painted for nearly eighty years. His prolific
            output — landscapes, portraits, the great industrial scenes of his
            Michigan years — sits scattered across private collections and
            provincial galleries. The Trust's work is to find these paintings,
            catalogue them, and make their stories accessible to anyone who
            cares to look.
          </p>
          <NuxtLink
            to="/artist"
            :style="{
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--ink)',
              background: 'transparent',
              border: '1px solid var(--ink)',
              borderRadius: '2px',
              padding: '13px 24px',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              textDecoration: 'none',
              display: 'inline-block',
            }"
          >
            Read about the artist
          </NuxtLink>
        </div>
        <blockquote
          :style="{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '40px',
            lineHeight: 1.22,
            color: 'var(--ink)',
            margin: 0,
            paddingLeft: '32px',
            borderLeft: '2px solid var(--sienna)',
            maxWidth: '20ch',
          }"
        >
          "The greatest English painter in watercolour of our time."
          <cite
            :style="{
              display: 'block',
              marginTop: '18px',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontStyle: 'normal',
              color: 'var(--ink-3)',
              letterSpacing: '0.06em',
            }"
          >
            — Augustus John, c. 1930
          </cite>
        </blockquote>
      </div>
    </section>

    <!-- Full library -->
    <section id="library" :style="sectionStyle">
      <div :style="headStyle">
        <div>
          <div :style="eyebrowStyle"><span :style="ruleStyle" />THE COMPLETE CATALOGUE</div>
          <h3 :style="h3Style">All {{ all.length }} works</h3>
        </div>
      </div>
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
    </section>

    <!-- Journal -->
    <section :style="sectionStyle">
      <div :style="headStyle">
        <div>
          <div :style="eyebrowStyle"><span :style="ruleStyle" />THE TRUST JOURNAL</div>
          <h3 :style="h3Style">From the catalogue room</h3>
        </div>
        <NuxtLink to="/blog" :style="viewAllStyle">All journal entries →</NuxtLink>
      </div>
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }">
        <NuxtLink
          v-for="j in journal.slice(0, 3)"
          :key="j.id"
          to="/blog"
          :style="{
            background: 'transparent',
            border: 0,
            padding: '28px 0 0',
            textAlign: 'left',
            cursor: 'pointer',
            borderTop: '1px solid var(--ink)',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
          }"
        >
          <div
            :style="{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              fontWeight: 600,
              marginBottom: '16px',
            }"
          >
            {{ j.date }}
          </div>
          <div
            :style="{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '12px',
            }"
          >
            {{ j.title }}
          </div>
          <div
            :style="{
              fontFamily: 'var(--font-body)',
              fontSize: '15.5px',
              lineHeight: 1.55,
              color: 'var(--ink-2)',
              marginBottom: '16px',
            }"
          >
            {{ j.dek }}
          </div>
          <div
            :style="{
              fontFamily: 'var(--font-ui)',
              fontSize: '11.5px',
              color: 'var(--ink-3)',
              letterSpacing: '0.04em',
            }"
          >
            By {{ j.author }}
          </div>
        </NuxtLink>
      </div>
    </section>
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
