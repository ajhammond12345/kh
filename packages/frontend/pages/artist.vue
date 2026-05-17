<script setup lang="ts">
useHead({ title: 'The Artist — Arthur Henry Knighton-Hammond' })
</script>

<template>
  <div :style="{ maxWidth: '800px', margin: '64px auto 0', padding: '0 32px 96px' }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.20em', fontWeight: 600, color: 'var(--ink-3)', marginBottom: '16px', textTransform: 'uppercase' }">
      <span :style="{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--sienna)' }" />
      BIOGRAPHY
    </div>
    <h1 :style="{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 8px' }">
      Arthur Henry Knighton-Hammond
    </h1>
    <p :style="{ fontFamily: 'var(--font-body)', fontSize: '19px', color: 'var(--ink-2)', margin: '0 0 48px' }">
      1875&ndash;1970
    </p>

    <div class="kh-prose">
      <h2>Early Life</h2>
      <p>
        Arthur Henry Hammond was born in Arnold, Nottinghamshire on 18 September 1875.
        He showed an interest in art from an early age and his parents bought him his first
        box of paints when Arthur was 6 years old. On leaving school aged 12, Arthur spent
        a short period working in his brother's grocery shop before being apprenticed to a
        watchmaker in Nottingham.
      </p>
      <p>
        Not happy with his new career, Arthur began attending evening classes at Nottingham
        School of Art. He excelled and gave up working at the watchmakers 6 months short of
        his indenture period and set about making a living from art. In 1895 the budding
        young artist exhibited for the first time at Nottingham Castle Museum and continued
        to do so annually until 1899. He was a frequent visitor to Haddon Hall working
        alongside more experienced local artists who took him under their wing.
      </p>

      <h2>London and Beyond</h2>
      <p>
        In 1900 Arthur moved to London determined to expand his career. To this end he attended
        classes at Westminster and Chelsea Schools of Art. He supplemented his income by designing
        picture postcards for the leading publishers of the day such as Raphael Tuck.
      </p>
      <p>
        In 1905 Arthur returned to the Midlands settling for a while in Youlgreave in the Peak
        District in Derbyshire. In 1907 his talent was recognised when he had his first painting
        exhibited at the Royal Academy. This success followed a year later when he had another
        water-colour accepted by the RA.
      </p>
      <p>
        Around 1910 Arthur attended classes at Manchester Municipal School of Art studying under
        Adolphe Valette (1876&ndash;1942). This was probably the most influential tuition he received.
      </p>

      <h2>The Knighton-Hammond Name</h2>
      <p>
        In the early 1910s Arthur Hammond added his mother's maiden name of Knighton to his,
        using it as a Christian name featured in his signature. Later, in 1933, Knighton was
        added as part of his surname and hyphenated.
      </p>

      <h2>War Work and Continental Period</h2>
      <p>
        During the First World War Knighton-Hammond worked for British Dyestuffs at Blackley,
        Manchester and Huddersfield illustrating buildings constructed and the processes taking
        place as part of the war effort. After the war he went on a great adventure to the
        Dow Chemical plant in America. On his return he was to spend 10 years on the continent
        where his style developed.
      </p>

      <h2>Later Life</h2>
      <p>
        On his return to England, he lived in Alton in Hampshire, Ditchling in Sussex,
        Misterton in Somerset and Seaborough in Dorset where he died on 28 February 1970
        aged 94 years.
      </p>
      <p>
        Whilst Knighton-Hammond did not return to Nottingham, he did keep in touch with his
        roots and in 1946 he donated a collection of oil paintings and watercolours to Arnold
        Library. The Hammond family still live in the area to this day and are rightfully proud
        of the significant achievements of this remarkable artist and ancestor.
      </p>

      <h2>Honours and Memberships</h2>
      <ul>
        <li>Member of the Soci&eacute;t&eacute; Internationale des Aquarellistes</li>
        <li>Life Member of the American Water-Color Society</li>
        <li>Member of the Pastel Society</li>
        <li>Member of the Royal Institute of Painters in Water Colours</li>
        <li>Member of the Royal Institute of Oil Painters</li>
        <li>Member of the Royal Scottish Society of Painters in Watercolour</li>
      </ul>
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
.kh-prose ul {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.65;
  color: var(--ink-2);
  padding-left: 24px;
  margin: 0;
}
.kh-prose li { margin-bottom: 6px; }
</style>
