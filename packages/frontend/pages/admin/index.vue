<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/admin/gallery"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <h2 class="text-lg font-medium text-gray-900 mb-2">Gallery Management</h2>
        <p class="text-sm text-gray-600">Upload, edit, and manage artwork images and metadata.</p>
      </NuxtLink>
      <NuxtLink
        to="/admin/content"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <h2 class="text-lg font-medium text-gray-900 mb-2">Content Editor</h2>
        <p class="text-sm text-gray-600">Edit page content for About, Artist, Gallery Project, and more.</p>
      </NuxtLink>
      <a
        href="/"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <h2 class="text-lg font-medium text-gray-900 mb-2">View Site</h2>
        <p class="text-sm text-gray-600">Open the public-facing website.</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
</script>
