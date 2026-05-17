<template>
  <div class="kh kh-paper-grain" :style="{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }">
    <GalleryHeader />
    <main :style="{ flex: 1 }">
      <slot />
    </main>
    <GalleryFooter />
  </div>
</template>
