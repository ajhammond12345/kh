<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="font-display text-4xl md:text-5xl text-charcoal-900 mb-8">Social Media</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a
        v-for="link in socialLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="block bg-cream-100 rounded-lg p-6 hover:shadow-md transition-shadow border border-cream-200"
      >
        <h2 class="font-serif text-lg font-semibold text-charcoal-900 mb-2">
          {{ link.title }}
        </h2>
        <p class="font-serif text-sm text-charcoal-700 leading-relaxed">
          {{ link.description }}
        </p>
        <span class="inline-block mt-3 font-serif text-sm text-gallery-gold">
          Visit &rarr;
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Social Media — The Knighton-Hammond Charitable Trust' })

const socialLinks = [
  {
    title: 'Facebook Group',
    url: 'https://www.facebook.com/groups/229078159525663',
    description: 'The Arthur Henry Knighton-Hammond Appreciation Group gives commentary on posts of newly discovered or acquired paintings and events.',
  },
  {
    title: 'YouTube Channel',
    url: 'https://www.youtube.com/channel/UCPVP6xKN_vNn9BzmAMWmWnw',
    description: 'A series of videos with Peter Norris giving a commentary on the works featured.',
  },
  {
    title: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Arthur_Henry_Knighton-Hammond',
    description: "Knighton-Hammond's Wikipedia entry with biographical information and career highlights.",
  },
]
</script>
