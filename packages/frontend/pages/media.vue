<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="font-display text-4xl md:text-5xl text-charcoal-900 mb-8">The Artist in the Media</h1>

    <section class="mb-12">
      <h2 class="font-display text-2xl text-charcoal-900 mb-4">Biography</h2>
      <div class="bg-cream-100 rounded-lg p-6 border border-cream-200">
        <p class="font-serif font-semibold text-charcoal-900">Arthur Henry Knighton-Hammond</p>
        <p class="font-serif text-charcoal-700 mt-1">Author: Peter Norris, BA (Hons)</p>
        <p class="font-serif text-charcoal-700">Publisher: Lutterworth Press, Cambridge, 1994</p>
        <p class="font-serif text-sm text-charcoal-700 mt-2">
          Sponsored by The Herbert H &amp; Grace A Dow Foundation and Midland Center for the Arts
        </p>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="font-display text-2xl text-charcoal-900 mb-4">Magazine &amp; Newspaper Articles</h2>
      <ul class="space-y-3">
        <li
          v-for="article in articles"
          :key="article.title"
          class="font-serif text-charcoal-700 border-b border-cream-200 pb-3"
        >
          <span class="font-medium text-charcoal-900">{{ article.title }}</span>
          <span v-if="article.date" class="text-sm"> &mdash; {{ article.date }}</span>
          <p v-if="article.note" class="text-sm mt-1">{{ article.note }}</p>
        </li>
      </ul>
    </section>

    <section>
      <h2 class="font-display text-2xl text-charcoal-900 mb-4">TV &amp; Radio</h2>
      <ul class="space-y-3">
        <li
          v-for="item in tvRadio"
          :key="item.title"
          class="font-serif text-charcoal-700 border-b border-cream-200 pb-3"
        >
          <span class="font-medium text-charcoal-900">{{ item.title }}</span>
          <span v-if="item.date" class="text-sm"> &mdash; {{ item.date }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Artist's Media — The Knighton-Hammond Charitable Trust" })

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
