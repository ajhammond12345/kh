<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="font-display text-4xl md:text-5xl text-charcoal-900 mb-2">The Trustees</h1>
    <p class="font-serif text-lg text-charcoal-700 mb-10">
      The current Board of Trustees are all unpaid volunteers.
    </p>

    <div class="space-y-10">
      <div v-for="trustee in trustees" :key="trustee.name" class="flex gap-6 items-start">
        <div class="w-24 h-24 rounded-full bg-cream-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <span class="font-display text-2xl text-cream-300">{{ trustee.initials }}</span>
        </div>
        <div>
          <h2 class="font-serif text-xl font-semibold text-charcoal-900">
            {{ trustee.name }}
          </h2>
          <p class="font-serif text-sm text-gallery-gold mb-2">{{ trustee.role }}</p>
          <p class="font-serif text-charcoal-700 leading-relaxed">{{ trustee.bio }}</p>
          <a
            :href="`mailto:${trustee.email}`"
            class="inline-block mt-2 font-serif text-sm text-gallery-gold hover:text-gallery-bronze transition-colors"
          >
            {{ trustee.email }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'The Trustees — The Knighton-Hammond Charitable Trust' })

const trustees = [
  {
    name: 'Michael Hammond',
    initials: 'MH',
    role: 'Chair and Treasurer',
    email: 'michael.hammond@k-hct.org',
    bio: "The artist's great nephew and an avid collector of his great uncle's work. He holds the archive. His aims and desires are for his great uncle not to be forgotten and for his work to be on public display. Michael has lived all his life in Nottingham and wants to see the artist's legacy continuing on in his home city. As Chair and Treasurer, Michael oversees the workings and financial management of the charity and steers the direction moving forward.",
  },
  {
    name: 'Peter Norris, BA (Hons), FRICS',
    initials: 'PN',
    role: 'Secretary',
    email: 'peter.norris@k-hct.org',
    bio: "An art historian and life-long collector of Knighton-Hammond's work. He has written the biography of the artist. He has a large art history library and is a collector of other fine art. His vision is for a gallery of K-H's work for public appreciation and to raise the profile of the artist to place him in his rightful place in British art history. Peter is Secretary and is involved in the collections and curating the works of art in the charity's possession.",
  },
  {
    name: 'Nicolas Hammond, MA (Cantab)',
    initials: 'NH',
    role: 'Trustee',
    email: 'nicolas.hammond@k-hct.org',
    bio: "The artist's great, great nephew and a collector of his work. Like his father, Michael, he wants to continue to promote Knighton-Hammond and has a Knighton-Hammond collection in his home in America.",
  },
  {
    name: 'Jonathan Hammond, MBE',
    initials: 'JH',
    role: 'Trustee',
    email: 'jonathan.hammond@k-hct.org',
    bio: "The artist's great, great nephew and a collector of his work. Like his father, Michael and brother Nicolas, he wants Knighton-Hammond's legacy to continue and supports the project for a permanent gallery. Jonathan is involved in promotional aspects of the project and all things relating to Knighton-Hammond.",
  },
]
</script>
