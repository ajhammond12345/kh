<script setup lang="ts">
useHead({ title: 'The Trustees — Knighton-Hammond Charitable Trust' })

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

<template>
  <div :style="{ maxWidth: '800px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      GOVERNANCE
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 8px' }">
      The Trustees
    </h1>
    <p :style="{ fontFamily: 'var(--font-body)', fontSize: '19px', color: 'var(--ink-2)', margin: '0 0 48px' }">
      The current Board of Trustees are all unpaid volunteers.
    </p>

    <div :style="{ display: 'flex', flexDirection: 'column', gap: '0' }">
      <div
        v-for="trustee in trustees"
        :key="trustee.name"
        :style="{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '32px 0', borderTop: '1px solid var(--hairline)' }"
      >
        <div class="kh-avatar">
          {{ trustee.initials }}
        </div>
        <div :style="{ flex: 1 }">
          <div :style="{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, color: 'var(--ink)' }">
            {{ trustee.name }}
          </div>
          <div :style="{ fontFamily: 'var(--font-ui)', fontSize: '12px', letterSpacing: '0.08em', color: 'var(--sienna)', fontWeight: 600, marginTop: '2px', marginBottom: '12px' }">
            {{ trustee.role }}
          </div>
          <p :style="{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.65, color: 'var(--ink-2)', margin: '0 0 8px', maxWidth: '60ch' }">
            {{ trustee.bio }}
          </p>
          <a
            :href="`mailto:${trustee.email}`"
            :style="{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--sienna)', textDecoration: 'underline', textUnderlineOffset: '2px' }"
          >
            {{ trustee.email }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kh-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--paper-2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--ink-3);
}
</style>
