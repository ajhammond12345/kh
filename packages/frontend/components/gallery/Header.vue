<script setup lang="ts">
import type { GalleryArtwork } from '~/composables/useArtworks'

const route = useRoute()
const { artworks } = useArtworks()

const transparent = computed(() => route.path === '/')

const items = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'gallery', label: 'Artwork library', path: '/library' },
  { id: 'artist', label: 'Biography', path: '/artist' },
  { id: 'blog', label: 'Blog', path: '/blog' },
  { id: 'support', label: 'Support', path: '/about' },
]

const scrolled = ref(false)
const searchOpen = ref(false)
const drawerOpen = ref(false)
const q = ref('')
const drawerQ = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const drawerInputRef = ref<HTMLInputElement | null>(null)

const trans = computed(() => transparent.value && !scrolled.value)

const results = computed<GalleryArtwork[]>(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return []
  const works = artworks.filter((w) => w.status === 'published')
  return works
    .filter(
      (w) =>
        w.title.toLowerCase().includes(needle) ||
        (w.subject || '').toLowerCase().includes(needle) ||
        (w.location || '').toLowerCase().includes(needle) ||
        (w.year || '').toLowerCase().includes(needle) ||
        (w.tags || []).some((t) => t.toLowerCase().includes(needle)) ||
        (w.medium || '').toLowerCase().includes(needle),
    )
    .slice(0, 8)
})

const drawerResults = computed<GalleryArtwork[]>(() => {
  const needle = drawerQ.value.trim().toLowerCase()
  if (!needle) return []
  const works = artworks.filter((w) => w.status === 'published')
  return works
    .filter(
      (w) =>
        w.title.toLowerCase().includes(needle) ||
        (w.subject || '').toLowerCase().includes(needle) ||
        (w.location || '').toLowerCase().includes(needle) ||
        (w.year || '').toLowerCase().includes(needle) ||
        (w.tags || []).some((t) => t.toLowerCase().includes(needle)) ||
        (w.medium || '').toLowerCase().includes(needle),
    )
    .slice(0, 8)
})

const publishedCount = computed(
  () => artworks.filter((w) => w.status === 'published').length,
)

function isActive(item: typeof items[number]) {
  if (item.id === 'home') return route.path === '/'
  return route.path.startsWith(item.path)
}

function onScroll() { scrolled.value = window.scrollY > 8 }
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = true
  } else if (e.key === 'Escape') {
    searchOpen.value = false
    drawerOpen.value = false
  }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})

watch(searchOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
  }
})

watch(drawerOpen, async (open) => {
  if (open) {
    await nextTick()
    drawerInputRef.value?.focus()
  }
})

watch(route, () => { drawerOpen.value = false })

const suggestions = ['Riviera', 'Derbyshire', 'Industrial', 'Venice', 'Portrait', '1920s']

const searchIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`
</script>

<template>
  <header
    data-screen-label="Header"
    class="kh-header"
    :class="{ 'kh-header--trans': trans }"
  >
    <!-- Row 1: brand + search + nav (desktop), brand + nav (medium), search + hamburger (mobile) -->
    <div class="kh-header__row1">
      <!-- Brand — hidden on mobile -->
      <NuxtLink to="/" class="kh-header__brand">
        <div :style="{ lineHeight: 1.05 }">
          <div class="kh-header__brand-name">Knighton Hammond</div>
          <div class="kh-header__brand-sub" :class="{ 'kh-header__brand-sub--trans': trans }">
            <span :style="{ width: '18px', height: '1px', background: 'var(--sienna)', display: 'inline-block' }" />
            ARTWORK LIBRARY
          </div>
        </div>
      </NuxtLink>

      <!-- Search trigger — visible at all sizes -->
      <div class="kh-header__search">
        <button
          aria-label="Search the library"
          class="kh-header__search-btn"
          :class="{ 'kh-header__search-btn--trans': trans }"
          @click="searchOpen = true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="kh-header__search-icon" :class="{ 'kh-header__search-icon--trans': trans }" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span class="kh-header__search-text">Search the artwork library…</span>
          <span class="kh-header__search-kbd" :class="{ 'kh-header__search-kbd--trans': trans }">⌘K</span>
        </button>
      </div>

      <!-- Nav — hidden on mobile -->
      <nav class="kh-header__nav">
        <NuxtLink
          v-for="item in items"
          :key="item.id"
          :to="item.path"
          class="kh-header__nav-link"
          :style="{
            color: isActive(item)
              ? (trans ? '#FAF6EC' : 'var(--ink)')
              : (trans ? 'rgb(250 246 236 / 0.78)' : 'var(--ink-2)'),
          }"
        >
          {{ item.label }}
          <span v-if="isActive(item)" class="kh-header__nav-active" />
        </NuxtLink>
        <NuxtLink
          to="/admin"
          class="kh-header__nav-cta"
          :class="{ 'kh-header__nav-cta--trans': trans }"
        >
          Add an artwork
        </NuxtLink>
      </nav>

      <!-- Hamburger — mobile only -->
      <button
        class="kh-header__hamburger"
        :class="{ 'kh-header__hamburger--trans': trans }"
        aria-label="Open menu"
        @click="drawerOpen = !drawerOpen"
      >
        <svg v-if="!drawerOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Mobile drawer -->
    <Teleport to="body">
      <Transition name="kh-drawer">
        <div v-if="drawerOpen" class="kh-drawer-overlay" @click="drawerOpen = false">
          <div class="kh-drawer" @click.stop>
            <!-- Drawer search -->
            <div class="kh-drawer__search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" :style="{ color: 'var(--ink-3)', flexShrink: 0 }" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                ref="drawerInputRef"
                v-model="drawerQ"
                placeholder="Search artworks…"
                class="kh-drawer__search-input"
              />
            </div>

            <!-- Drawer search results -->
            <div v-if="drawerQ.trim()" class="kh-drawer__results">
              <div v-if="drawerResults.length === 0" class="kh-drawer__empty">
                No artworks match "{{ drawerQ }}".
              </div>
              <NuxtLink
                v-for="w in drawerResults"
                :key="w.id"
                :to="`/gallery/${w.id}`"
                class="kh-drawer__result"
                @click="drawerOpen = false"
              >
                <div class="kh-drawer__result-title">{{ w.title }}</div>
                <div class="kh-drawer__result-meta">{{ w.year }} · {{ w.medium }}</div>
              </NuxtLink>
            </div>

            <!-- Drawer nav -->
            <nav class="kh-drawer__nav">
              <NuxtLink
                v-for="item in items"
                :key="item.id"
                :to="item.path"
                class="kh-drawer__nav-link"
                :class="{ 'kh-drawer__nav-link--active': isActive(item) }"
                @click="drawerOpen = false"
              >
                {{ item.label }}
              </NuxtLink>
              <NuxtLink to="/admin" class="kh-drawer__nav-cta" @click="drawerOpen = false">
                Add an artwork
              </NuxtLink>
            </nav>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Search overlay (shared across all sizes) -->
    <Teleport to="body">
      <div
        v-if="searchOpen"
        @click="searchOpen = false"
        :style="{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgb(22 26 34 / 0.58)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '12vh',
        }"
      >
        <div
          @click.stop
          :style="{
            width: 'min(720px, 92vw)',
            background: 'var(--paper-2)',
            boxShadow: 'var(--shadow-3)',
            color: 'var(--ink)',
            height: 'fit-content',
          }"
        >
          <div :style="{ padding: '16px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: '12px' }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" :style="{ color: 'var(--ink-3)' }" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref="inputRef"
              v-model="q"
              placeholder="Search artworks — try 'Venice', 'Riviera', 'Dow'…"
              :style="{
                flex: 1,
                background: 'transparent',
                border: 0,
                outline: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 500,
                color: 'var(--ink)',
              }"
            />
            <span :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.08em' }">
              ESC to close
            </span>
          </div>
          <div :style="{ maxHeight: '60vh', overflowY: 'auto' }">
            <div v-if="!q.trim()" :style="{ padding: '24px' }">
              <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', color: 'var(--ink-3)', marginBottom: '12px', textTransform: 'uppercase' }">
                Try
              </div>
              <div :style="{ display: 'flex', gap: '8px', flexWrap: 'wrap' }">
                <button
                  v-for="s in suggestions"
                  :key="s"
                  @click="q = s"
                  :style="{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: 'var(--parchment)',
                    border: 0,
                    padding: '6px 12px',
                    cursor: 'pointer',
                    color: 'var(--ink)',
                  }"
                >{{ s }}</button>
              </div>
            </div>
            <div
              v-else-if="results.length === 0"
              :style="{ padding: '24px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-2)' }"
            >
              No artworks match <em>"{{ q }}"</em>.
              <span :style="{ color: 'var(--ink-3)' }">The catalogue is growing — write to the Trust if you believe a missing painting should be here.</span>
            </div>
            <ul v-else :style="{ listStyle: 'none', margin: 0, padding: 0 }">
              <li v-for="w in results" :key="w.id">
                <NuxtLink
                  :to="`/gallery/${w.id}`"
                  @click="searchOpen = false"
                  :style="{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '12px 20px',
                    background: 'transparent',
                    border: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderTop: '1px solid var(--hairline)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }"
                >
                  <div :style="{ width: '60px', height: '75px', overflow: 'hidden', background: 'var(--parchment)' }">
                    <GalleryArtworkImage :work="w" frame="bare" ratio="4 / 5" :lazy="false" />
                  </div>
                  <div>
                    <div :style="{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '18px', color: 'var(--ink)' }">
                      {{ w.title }}
                    </div>
                    <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-2)', marginTop: '2px' }">
                      {{ w.year }} · {{ w.medium }} · {{ w.location }}
                    </div>
                  </div>
                  <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.08em' }">
                    {{ w.subject }}
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div
            :style="{
              padding: '10px 20px',
              borderTop: '1px solid var(--hairline)',
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              color: 'var(--ink-3)',
              display: 'flex',
              justifyContent: 'space-between',
            }"
          >
            <span>Searching {{ publishedCount }} catalogued works.</span>
            <NuxtLink
              to="/gallery"
              @click="searchOpen = false"
              :style="{ background: 'transparent', border: 0, color: 'var(--sienna)', fontWeight: 600, cursor: 'pointer', fontSize: '11px', textDecoration: 'none' }"
            >
              Browse the full library →
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<style scoped>
/* ── Base header ── */
.kh-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(246 241 231 / 0.86);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--hairline);
  transition: background 280ms var(--ease), border-color 280ms;
  color: var(--ink);
}
.kh-header--trans {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom-color: rgb(255 255 255 / 0.12);
  color: #FAF6EC;
}

/* ── Row 1 ── */
.kh-header__row1 {
  max-width: 1320px;
  margin: 0 auto;
  padding: 14px 32px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 32px;
}

/* ── Brand ── */
.kh-header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}
.kh-header__brand-name {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  letter-spacing: -0.005em;
}
.kh-header__brand-sub {
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ink-3);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 3px;
}
.kh-header__brand-sub--trans { color: rgb(250 246 236 / 0.7); }

/* ── Search trigger ── */
.kh-header__search {
  position: relative;
  justify-self: center;
  width: 100%;
  max-width: 460px;
}
.kh-header__search-btn {
  width: 100%;
  background: var(--paper-2);
  border: 1px solid var(--hairline);
  border-radius: 999px;
  padding: 8px 14px 8px 36px;
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--ink-3);
  cursor: text;
  text-align: left;
  transition: all 200ms;
  position: relative;
}
.kh-header__search-btn--trans {
  background: rgb(255 255 255 / 0.10);
  border-color: rgb(255 255 255 / 0.18);
  color: rgb(250 246 236 / 0.78);
}
.kh-header__search-icon {
  position: absolute;
  left: 12px;
  top: 9px;
  color: var(--ink-3);
}
.kh-header__search-icon--trans { color: rgb(250 246 236 / 0.7); }
.kh-header__search-kbd {
  position: absolute;
  right: 10px;
  top: 8px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--parchment);
  color: var(--ink-3);
  font-weight: 600;
  letter-spacing: 0.04em;
}
.kh-header__search-kbd--trans {
  background: rgb(255 255 255 / 0.14);
  color: rgb(250 246 236 / 0.7);
}

/* ── Nav ── */
.kh-header__nav {
  display: flex;
  gap: 22px;
  align-items: center;
}
.kh-header__nav-link {
  position: relative;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: var(--font-ui);
  font-size: 13.5px;
  font-weight: 500;
  padding: 6px 0;
  text-decoration: none;
}
.kh-header__nav-active {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: var(--sienna);
}
.kh-header__nav-cta {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: var(--ink);
  color: #FAF6EC;
  border: 0;
  border-radius: 2px;
  padding: 8px 14px;
  cursor: pointer;
  margin-left: 6px;
  text-decoration: none;
  display: inline-block;
}
.kh-header__nav-cta--trans {
  background: rgb(255 255 255 / 0.10);
  border: 1px solid rgb(255 255 255 / 0.22);
}

/* ── Hamburger ── */
.kh-header__hamburger {
  display: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 6px;
  color: var(--ink);
}
.kh-header__hamburger--trans { color: #FAF6EC; }

/* ── Mobile drawer ── */
.kh-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgb(22 26 34 / 0.4);
}
.kh-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: min(320px, 85vw);
  height: 100%;
  background: var(--paper);
  box-shadow: var(--shadow-3);
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.kh-drawer__search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--paper-2);
  border: 1px solid var(--hairline);
  border-radius: 6px;
}
.kh-drawer__search-input {
  flex: 1;
  background: transparent;
  border: 0;
  outline: none;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 500;
  color: var(--ink);
}
.kh-drawer__results {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.kh-drawer__empty {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--ink-2);
  padding: 8px 0;
}
.kh-drawer__result {
  display: block;
  padding: 10px 0;
  border-top: 1px solid var(--hairline);
  text-decoration: none;
  color: inherit;
}
.kh-drawer__result-title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 16px;
  color: var(--ink);
}
.kh-drawer__result-meta {
  font-family: var(--font-ui);
  font-size: 11px;
  color: var(--ink-2);
  margin-top: 2px;
}
.kh-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid var(--hairline);
  padding-top: 16px;
}
.kh-drawer__nav-link {
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-2);
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid var(--hairline);
}
.kh-drawer__nav-link--active {
  color: var(--ink);
  font-weight: 600;
}
.kh-drawer__nav-cta {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: var(--ink);
  color: #FAF6EC;
  border: 0;
  border-radius: 2px;
  padding: 12px 18px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  margin-top: 12px;
}

/* Drawer transitions */
.kh-drawer-enter-active,
.kh-drawer-leave-active {
  transition: opacity 200ms var(--ease);
}
.kh-drawer-enter-active .kh-drawer,
.kh-drawer-leave-active .kh-drawer {
  transition: transform 280ms var(--ease);
}
.kh-drawer-enter-from,
.kh-drawer-leave-to {
  opacity: 0;
}
.kh-drawer-enter-from .kh-drawer,
.kh-drawer-leave-to .kh-drawer {
  transform: translateX(100%);
}

/* ── Medium screens (641–960): search drops to row 2 ── */
@media (min-width: 641px) and (max-width: 960px) {
  .kh-header__row1 {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 12px 32px;
    padding: 12px 24px;
  }
  .kh-header__brand { grid-column: 1; grid-row: 1; }
  .kh-header__nav   { grid-column: 2; grid-row: 1; justify-self: end; }
  .kh-header__search {
    grid-column: 1 / -1;
    grid-row: 2;
    max-width: none;
    justify-self: stretch;
  }
}

/* ── Mobile (≤640): search + hamburger only ── */
@media (max-width: 640px) {
  .kh-header__row1 {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
    gap: 12px;
    padding: 10px 16px;
  }
  .kh-header__brand { display: none; }
  .kh-header__nav   { display: none; }
  .kh-header__search {
    grid-column: 1;
    grid-row: 1;
    max-width: none;
    justify-self: stretch;
  }
  .kh-header__search-text { display: none; }
  .kh-header__search-btn {
    padding: 10px 14px 10px 36px;
  }
  .kh-header__search-btn::after {
    content: 'Search…';
  }
  .kh-header__hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 2;
    grid-row: 1;
    width: 40px;
    height: 40px;
  }
}
</style>
