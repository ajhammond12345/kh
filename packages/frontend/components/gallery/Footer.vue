<script setup lang="ts">
const linkStyle = {
  background: 'transparent',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'left' as const,
  textDecoration: 'none',
}
</script>

<template>
  <footer
    data-screen-label="Footer"
    :style="{ background: 'var(--parchment)', padding: '80px 32px 40px', marginTop: '96px' }"
  >
    <div
      :style="{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '56px',
      }"
    >
      <div>
        <div :style="{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)', fontWeight: 500, letterSpacing: '-0.005em' }">
          Knighton Hammond
        </div>
        <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.20em', color: 'var(--ink-3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }">
          <span :style="{ width: '18px', height: '1px', background: 'var(--sienna)' }" />
          CHARITABLE TRUST
        </div>
        <p :style="{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-2)', margin: '20px 0 16px', maxWidth: '32ch', lineHeight: 1.55 }">
          A registered charity dedicated to conserving and promoting the work
          of Arthur Henry Knighton-Hammond (1875 – 1970).
        </p>
        <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '11.5px', color: 'var(--ink-3)', lineHeight: 1.7 }">
          <div>Reg. charity no. 1170032</div>
        </div>
      </div>

      <div>
        <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 600, marginBottom: '18px' }">
          The artist
        </div>
        <ul :style="{ listStyle: 'none', margin: 0, padding: 0 }">
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/artist" :style="linkStyle">Biography</NuxtLink>
          </li>
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/library" :style="linkStyle">Artwork library</NuxtLink>
          </li>
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/media" :style="linkStyle">Media &amp; bibliography</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 600, marginBottom: '18px' }">
          The Trust
        </div>
        <ul :style="{ listStyle: 'none', margin: 0, padding: 0 }">
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/about" :style="linkStyle">About us</NuxtLink>
          </li>
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/trustees" :style="linkStyle">Trustees</NuxtLink>
          </li>
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/gallery-project" :style="linkStyle">Gallery project</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 600, marginBottom: '18px' }">
          Library
        </div>
        <ul :style="{ listStyle: 'none', margin: 0, padding: 0 }">
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/library" :style="linkStyle">Browse the library</NuxtLink>
          </li>
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/blog" :style="linkStyle">The Trust journal</NuxtLink>
          </li>
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/social" :style="linkStyle">Social media</NuxtLink>
          </li>
          <li :style="{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', padding: '5px 0' }">
            <NuxtLink to="/admin" :style="linkStyle">Trustee login</NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div
      :style="{
        maxWidth: '1320px',
        margin: '0 auto',
        paddingTop: '32px',
        marginTop: '56px',
        borderTop: '1px solid var(--hairline)',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-ui)',
        fontSize: '11.5px',
        color: 'var(--ink-3)',
        letterSpacing: '0.02em',
      }"
    >
      <span>© {{ new Date().getFullYear() }} Knighton Hammond Charitable Trust</span>
      <span :style="{ display: 'flex', gap: '8px' }">
        <NuxtLink to="/privacy" :style="linkStyle">Privacy</NuxtLink>
      </span>
    </div>
  </footer>
</template>
