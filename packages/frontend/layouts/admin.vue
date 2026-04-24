<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-charcoal-900 text-white px-6 py-3 flex items-center justify-between">
      <NuxtLink to="/admin" class="font-serif text-lg">K-H Admin</NuxtLink>
      <nav class="flex gap-4 text-sm">
        <NuxtLink to="/admin/gallery" class="hover:text-gallery-gold transition-colors">Gallery</NuxtLink>
        <NuxtLink to="/admin/content" class="hover:text-gallery-gold transition-colors">Content</NuxtLink>
        <NuxtLink to="/" class="hover:text-gallery-gold transition-colors">View Site</NuxtLink>
      </nav>
    </header>
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
