<script setup lang="ts">
useHead({ title: 'The Artist in the Media — Knighton-Hammond Charitable Trust' })

const articles = [
  { title: 'The Studio, Volume 88, No. 380', date: '1924', note: null },
  { title: 'The Artist Magazine', date: 'September 1939 – January 1940', note: 'Pastel Painting' },
  { title: 'The Western Gazette', date: '6 March 1970', note: 'Tribute by Monica Hutchings' },
  { title: 'Sussex Express', date: '19 August 1994', note: null },
  { title: 'Art Prices Review', date: 'Winter 1995', note: null },
  { title: 'Chemical Heritage (USA)', date: 'Summer 1996', note: null },
  { title: 'Michigan History', date: 'July/August 1996', note: 'Painting Dow Chemical by Laura Rose Ashlee' },
  { title: 'Nottingham Post', date: '14 July 2016', note: "'Bygones' illustrated article by Andy Smart" },
  { title: 'West Country Life', date: '25 July 2020', note: null },
  { title: 'MidSussex Times', date: '27 August 2020', note: null },
  { title: 'Derbyshire Life', date: 'September 2023', note: null },
  { title: 'Somerset Life', date: 'April 2026', note: 'A Change of Art' },
]

const tvRadio = [
  { title: 'BBC Radio Nottingham — Review of Arnold Library exhibition', date: '1994' },
  { title: 'BBC Radio 4 — Anderson Country — Feature on Knighton-Hammond', date: 'c.1996' },
  { title: 'BBC 1 — Antiques Roadshow, Southwell Minster', date: '26 October 2008' },
  { title: 'BBC East Midlands TV News — Feature on Bromley House Library exhibition', date: '2016' },
]
</script>

<template>
  <div :style="{ maxWidth: '800px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      PRESS &amp; MEDIA
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 48px' }">
      The Artist in the Media
    </h1>

    <section :style="{ marginBottom: '64px' }">
      <h2 class="kh-h2">Biography</h2>
      <div :style="{ background: 'var(--paper-2)', padding: '24px', borderLeft: '2px solid var(--sienna)' }">
        <div :style="{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--ink)', fontSize: '17px' }">
          Arthur Henry Knighton-Hammond
        </div>
        <div :style="{ fontFamily: 'var(--font-body)', color: 'var(--ink-2)', fontSize: '15px', marginTop: '4px' }">
          Author: Peter Norris, BA (Hons)
        </div>
        <div :style="{ fontFamily: 'var(--font-body)', color: 'var(--ink-2)', fontSize: '15px' }">
          Publisher: Lutterworth Press, Cambridge, 1994
        </div>
        <div :style="{ fontFamily: 'var(--font-body)', color: 'var(--ink-3)', fontSize: '14px', marginTop: '8px' }">
          Sponsored by The Herbert H &amp; Grace A Dow Foundation and Midland Center for the Arts
        </div>
      </div>
    </section>

    <section :style="{ marginBottom: '64px' }">
      <h2 class="kh-h2">Magazine &amp; Newspaper Articles</h2>
      <div class="kh-list">
        <div
          v-for="article in articles"
          :key="article.title"
          class="kh-list-item"
        >
          <div :style="{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--ink)', fontSize: '16px' }">
            {{ article.title }}
            <span v-if="article.date" :style="{ fontWeight: 400, color: 'var(--ink-3)' }"> &mdash; {{ article.date }}</span>
          </div>
          <div v-if="article.note" :style="{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-2)', marginTop: '2px' }">
            {{ article.note }}
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="kh-h2">TV &amp; Radio</h2>
      <div class="kh-list">
        <div
          v-for="item in tvRadio"
          :key="item.title"
          class="kh-list-item"
        >
          <div :style="{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--ink)', fontSize: '16px' }">
            {{ item.title }}
            <span v-if="item.date" :style="{ fontWeight: 400, color: 'var(--ink-3)' }"> &mdash; {{ item.date }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.kh-h2 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 20px;
  line-height: 1.2;
}
.kh-list-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--hairline);
}
.kh-list-item:first-child {
  border-top: 1px solid var(--hairline);
}
</style>
