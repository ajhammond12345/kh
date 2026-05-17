<script setup lang="ts">
useHead({ title: 'Journal — Knighton Hammond Charitable Trust' })

const { journal } = useArtworks()
</script>

<template>
  <div
    :style="{
      maxWidth: '900px',
      margin: '64px auto 0',
      padding: '0 32px 96px',
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
        color: 'var(--ink-3)',
        marginBottom: '16px',
        textTransform: 'uppercase',
      }"
    >
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      THE TRUST JOURNAL
    </div>
    <h1
      :style="{
        fontFamily: 'var(--font-display)',
        fontSize: '48px',
        fontWeight: 500,
        lineHeight: 1.08,
        letterSpacing: '-0.01em',
        color: 'var(--ink)',
        margin: '0 0 48px',
      }"
    >
      From the catalogue room
    </h1>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '0' }">
      <article
        v-for="j in journal"
        :key="j.id"
        :style="{
          padding: '40px 0',
          borderTop: '1px solid var(--hairline)',
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
        <h2
          :style="{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 500,
            lineHeight: 1.18,
            color: 'var(--ink)',
            margin: '0 0 12px',
          }"
        >
          {{ j.title }}
        </h2>
        <p
          :style="{
            fontFamily: 'var(--font-body)',
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'var(--ink-2)',
            margin: '0 0 16px',
            maxWidth: '65ch',
          }"
        >
          {{ j.dek }}
        </p>
        <div
          :style="{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            color: 'var(--ink-3)',
            letterSpacing: '0.04em',
          }"
        >
          By {{ j.author }}
        </div>
      </article>
    </div>
  </div>
</template>
