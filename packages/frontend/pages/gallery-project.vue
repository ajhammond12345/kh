<script setup lang="ts">
useHead({ title: 'The Gallery Project — Knighton-Hammond Charitable Trust' })
</script>

<template>
  <div :style="{ maxWidth: '800px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      OUR VISION
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 48px' }">
      The Gallery Project
    </h1>

    <div class="kh-prose">
      <p class="kh-lede">
        The Trust is actively seeking a partner (or partners) to take the gallery project
        forward for the people of Nottingham.
      </p>
      <p>
        The creation of a Knighton-Hammond Gallery would present a unique opportunity to pay
        homage to the artist with a permanent collection of his works on display and to provide
        further interest in connoisseurship relating to art history within a learned environment.
      </p>
      <p>
        The Trust's desire is for Knighton-Hammond's work to be on public display in a
        high-quality art gallery. The collection in the custodianship of the Trust contains
        exceptional examples of the artist's work. Knighton-Hammond has yet to receive his
        true recognition but there is little doubt as to his talent with a variety of subjects
        and working in all media.
      </p>

      <h2>Education and Innovation</h2>
      <p>
        Our aim is for a progressive approach to innovation and to have different aims to the norm.
        Our view is that not only should the gallery provide a display of works of art but it should
        aim to educate and inform visitors as to how these works of art were made including the art
        of etching which Knighton-Hammond was very involved in.
      </p>

      <h2>The Artist's Studio</h2>
      <p>
        Having a permanent studio set up in the Knighton-Hammond Gallery reminiscent of those we
        know from photographs to demonstrate the artist at work and how the works of art were
        created. Contents would include all types of artist's materials, easels, palettes, paint
        boxes, paints, brushes, copper etching plates, etc. There are many examples of artist
        studios, and one very good example can be found at Rembrandt's House in Amsterdam.
      </p>

      <h2>The Study Centre</h2>
      <p>
        As part of the gallery, it is proposed to have a study centre. This would be rich in
        culture and history and also an indulgent retreat. Students would be able to work in the
        library in a more private and contemplative environment away from their busy lives. It
        needs, therefore, the appropriate artefacts and contents to create and maintain a mood
        conducive to a learned environment.
      </p>
      <p>
        Post-graduates would also be able to learn curatorial skills by working with the gallery
        staff. The centre would combine traditional methods of study with the latest online technology.
      </p>

      <h2>A Vision for Nottingham</h2>
      <p>
        The Trust is ambitious and is conscious that some galleries focus on their local artist.
        The Lowry in Salford is named after L S Lowry and has hosted exhibitions of his work and
        that of Adolphe Valette. Valette was master to Lowry and Knighton-Hammond when they were
        studying at Manchester Municipal School of Art. What a coup it would be for Nottingham to
        host the first exhibition of the work of the three artists?
      </p>
      <p>
        Knighton-Hammond is not represented in his home city which the Trust wants to rectify.
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
.kh-lede {
  font-size: 19px !important;
  font-weight: 500;
  color: var(--ink) !important;
}
</style>
