<script setup lang="ts">
useHead({ title: 'Social Media — Knighton-Hammond Charitable Trust' })

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

<template>
  <div :style="{ maxWidth: '800px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      CONNECT
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 48px' }">
      Social Media
    </h1>

    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }">
      <a
        v-for="link in socialLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="kh-card"
      >
        <div :style="{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px' }">
          {{ link.title }}
        </div>
        <div :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6, color: 'var(--ink-2)', marginBottom: '16px' }">
          {{ link.description }}
        </div>
        <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--sienna)', letterSpacing: '0.02em' }">
          Visit &rarr;
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.kh-card {
  display: block;
  background: var(--paper-2);
  padding: 28px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease;
}
.kh-card:hover {
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.08);
}
</style>
