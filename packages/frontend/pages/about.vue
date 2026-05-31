<script setup lang="ts">
useHead({ title: 'About Us — Knighton-Hammond Charitable Trust' })
</script>

<template>
  <div :style="{ maxWidth: '800px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      THE TRUST
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 48px' }">
      About the Trust
    </h1>

    <div class="kh-prose">
      <p>
        The Knighton-Hammond Charitable Trust was established in the name of the artist
        Arthur Henry Knighton-Hammond by members of his family and his biographer. The Trust exists
        to promote the artist for the people of Nottingham and the wider community.
      </p>
      <p>
        The Trust's primary aim is to make the work of Knighton-Hammond available to the public
        in a gallery dedicated to his work. The Trust has custodianship of a large collection of
        the artist's work and its priority is to have these works on public display in his home
        city of Nottingham and to give Knighton-Hammond the recognition he truly deserves.
      </p>
      <p>
        The Trust is also focused on education with the intention of having an artist's studio
        set up in the gallery to demonstrate how the artworks were made. To make full use of
        donated material, the Trust intends to have an integrated study centre as part of the
        gallery for the study of art history.
      </p>

      <h2>Contact Us</h2>
      <p>
        For general enquiries: <a href="mailto:chair@k-hct.org" class="kh-link">chair@k-hct.org</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.kh-prose h2 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  color: var(--ink);
  margin: 48px 0 16px;
  line-height: 1.2;
}
.kh-prose p {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.65;
  color: var(--ink-2);
  margin: 0 0 16px;
  max-width: 65ch;
}
.kh-link {
  color: var(--sienna);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
