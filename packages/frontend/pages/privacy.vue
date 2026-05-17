<script setup lang="ts">
useHead({ title: 'Privacy Policy — Knighton-Hammond Charitable Trust' })
</script>

<template>
  <div :style="{ maxWidth: '800px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      LEGAL
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 48px' }">
      Privacy Policy
    </h1>

    <div class="kh-prose">
      <p>
        The Knighton-Hammond Charitable Trust is committed to protecting your privacy.
        This policy explains how we collect, use, and protect any information you provide
        when using this website.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect information when you contact us via email or through the website.
        This may include your name and email address.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        Any information collected is used solely for responding to your enquiries and will
        not be shared with third parties.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this policy, please contact us at
        <a href="mailto:chair@k-hct.org" class="kh-link">chair@k-hct.org</a>.
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
