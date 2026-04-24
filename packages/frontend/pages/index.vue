<template>
  <div>
    <!-- Hero Banner -->
    <section class="relative bg-charcoal-900 text-white overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-charcoal-900/80 to-charcoal-900/95 z-10" />
      <div class="relative z-20 text-center py-24 md:py-36 px-4">
        <h2 class="font-display text-4xl md:text-6xl lg:text-7xl mb-4">
          Arthur Henry Knighton-Hammond
        </h2>
        <p class="font-serif text-xl md:text-2xl text-cream-200 max-w-2xl mx-auto">
          1875 &ndash; 1970
        </p>
        <p class="font-serif text-lg text-cream-300 mt-4 max-w-3xl mx-auto leading-relaxed">
          A remarkably talented artist whose work spans landscapes, streetscapes, portraits,
          and still life across oils, watercolours, pastels, and etchings.
        </p>
        <div class="mt-8 flex gap-4 justify-center">
          <NuxtLink
            to="/gallery"
            class="px-6 py-3 bg-gallery-gold text-white font-serif rounded hover:bg-gallery-bronze transition-colors"
          >
            View Gallery
          </NuxtLink>
          <NuxtLink
            to="/artist"
            class="px-6 py-3 border border-cream-300 text-cream-200 font-serif rounded hover:bg-cream-300/10 transition-colors"
          >
            About the Artist
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Works -->
    <section class="max-w-gallery mx-auto px-4 py-16">
      <h2 class="font-display text-3xl md:text-4xl text-charcoal-900 text-center mb-2">
        Featured Works
      </h2>
      <p class="font-serif text-charcoal-700 text-center mb-10">
        A selection from the Trust's collection of over 500 catalogued artworks
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="bg-cream-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="aspect-[4/3] bg-cream-200 flex items-center justify-center">
            <span class="font-serif text-cream-300 text-sm">Artwork</span>
          </div>
          <div class="p-4">
            <h3 class="font-serif font-medium text-charcoal-900">Artwork Title</h3>
            <p class="font-serif text-sm text-charcoal-700 mt-1">Medium &middot; Date</p>
          </div>
        </div>
      </div>
      <div class="text-center mt-10">
        <NuxtLink
          to="/gallery"
          class="inline-block px-8 py-3 border-2 border-gallery-gold text-gallery-gold font-serif rounded hover:bg-gallery-gold hover:text-white transition-colors"
        >
          Browse Full Gallery
        </NuxtLink>
      </div>
    </section>

    <!-- Trust Mission -->
    <section class="bg-cream-100 py-16">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="font-display text-3xl md:text-4xl text-charcoal-900 mb-6">
          Our Mission
        </h2>
        <p class="font-serif text-lg text-charcoal-700 leading-relaxed">
          The Knighton-Hammond Charitable Trust was set up in 2025 to promote the artist
          Arthur Henry Knighton-Hammond for the people of Nottingham and the wider community.
          Our primary aim is to make the work of Knighton-Hammond available to the public
          in a gallery dedicated to his work.
        </p>
        <NuxtLink
          to="/about"
          class="inline-block mt-6 font-serif text-gallery-gold hover:text-gallery-bronze transition-colors"
        >
          Learn more about the Trust &rarr;
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
