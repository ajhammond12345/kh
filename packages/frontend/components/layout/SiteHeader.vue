<template>
  <header class="bg-cream-50 border-b border-cream-200">
    <!-- Banner -->
    <div class="text-center py-8 px-4">
      <NuxtLink to="/" class="inline-block">
        <h1 class="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal-900 tracking-wide">
          Knighton-Hammond
        </h1>
        <p class="font-serif text-lg md:text-xl text-charcoal-700 mt-1 tracking-widest uppercase">
          The Knighton-Hammond Charitable Trust
        </p>
      </NuxtLink>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:block border-t border-cream-200">
      <div class="max-w-gallery mx-auto px-4">
        <ul class="flex justify-center gap-1">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="block px-4 py-3 font-display text-lg transition-colors relative"
              :class="[
                isActive(item.path)
                  ? 'text-charcoal-900'
                  : 'text-charcoal-700 hover:text-charcoal-900',
              ]"
            >
              {{ item.label }}
              <span
                v-if="isActive(item.path)"
                class="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                :style="{ backgroundColor: item.color }"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Mobile Navigation -->
    <div class="md:hidden border-t border-cream-200">
      <button
        class="w-full px-4 py-3 flex items-center justify-between font-display text-lg text-charcoal-700"
        @click="mobileOpen = !mobileOpen"
      >
        <span>Menu</span>
        <svg
          class="w-5 h-5 transition-transform"
          :class="{ 'rotate-180': mobileOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <Transition name="slide">
        <ul v-if="mobileOpen" class="border-t border-cream-200 bg-cream-100">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="block px-6 py-3 font-display text-lg border-l-4 transition-colors"
              :class="isActive(item.path) ? 'text-charcoal-900 bg-cream-50' : 'text-charcoal-700 border-transparent'"
              :style="isActive(item.path) ? { borderLeftColor: item.color } : {}"
              @click="mobileOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)

const navItems = [
  { label: 'About Us', path: '/about', color: '#2C3E6B' },
  { label: 'The Artist', path: '/artist', color: '#8B6914' },
  { label: 'The Trustees', path: '/trustees', color: '#6B7F5E' },
  { label: 'Social Media', path: '/social', color: '#722F37' },
  { label: 'Gallery Project', path: '/gallery-project', color: '#B8860B' },
  { label: "Artist's Media", path: '/media', color: '#3A3A3A' },
  { label: 'Photo Gallery', path: '/gallery', color: '#8B6914' },
]

function isActive(path: string) {
  if (path === '/gallery') return route.path.startsWith('/gallery')
  return route.path === path
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
