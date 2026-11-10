<script setup lang="ts">
import type { ArtworkFields } from '~/composables/useArtworkAdmin'

const fields = defineModel<ArtworkFields>({ required: true })
withDefaults(defineProps<{ variant?: 'admin' | 'public'; idPrefix?: string }>(), {
  variant: 'admin',
  idPrefix: 'aw',
})
</script>

<template>
  <div class="kaf-grid">
    <div class="kaf-span">
      <label class="kha-label" :for="`${idPrefix}-title`">Title</label>
      <input :id="`${idPrefix}-title`" v-model="fields.title" type="text" class="kha-input" required maxlength="200" />
    </div>
    <div>
      <label class="kha-label" :for="`${idPrefix}-date`">Date</label>
      <input :id="`${idPrefix}-date`" v-model="fields.date" type="text" class="kha-input" :placeholder="variant === 'public' ? 'e.g. c. 1926, if known' : 'e.g. 1926'" />
    </div>
    <div v-if="variant === 'admin'">
      <label class="kha-label" :for="`${idPrefix}-decade`">Decade</label>
      <input :id="`${idPrefix}-decade`" v-model="fields.decade" type="text" class="kha-input" placeholder="Worked out from the date if blank" />
    </div>
    <div>
      <label class="kha-label" :for="`${idPrefix}-medium`">Medium</label>
      <input :id="`${idPrefix}-medium`" v-model="fields.medium" type="text" class="kha-input" placeholder="e.g. Watercolour" />
    </div>
    <div>
      <label class="kha-label" :for="`${idPrefix}-dimensions`">Dimensions</label>
      <input :id="`${idPrefix}-dimensions`" v-model="fields.dimensions" type="text" class="kha-input" placeholder="e.g. 35 cm x 50 cm" />
    </div>
    <div>
      <label class="kha-label" :for="`${idPrefix}-subject`">Subject</label>
      <input :id="`${idPrefix}-subject`" v-model="fields.subject" type="text" class="kha-input" placeholder="e.g. Landscape" />
    </div>
    <div>
      <label class="kha-label" :for="`${idPrefix}-location`">Location</label>
      <input :id="`${idPrefix}-location`" v-model="fields.location" type="text" class="kha-input" placeholder="Where it was painted" />
    </div>
    <div :class="{ 'kaf-span': variant === 'public' }">
      <label class="kha-label" :for="`${idPrefix}-signature`">Signature</label>
      <input :id="`${idPrefix}-signature`" v-model="fields.signature" type="text" class="kha-input" placeholder="e.g. Signed lower left" />
    </div>
    <div class="kaf-span">
      <label class="kha-label" :for="`${idPrefix}-description`">Description</label>
      <textarea
        :id="`${idPrefix}-description`"
        v-model="fields.description"
        rows="5"
        class="kha-textarea"
        maxlength="5000"
        :placeholder="variant === 'public' ? 'Anything you know about the work: where it is now, how it came to you, exhibitions, inscriptions.' : ''"
      />
    </div>
  </div>
</template>

<style scoped>
.kaf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.kaf-span {
  grid-column: 1 / -1;
}
@media (max-width: 640px) {
  .kaf-grid {
    grid-template-columns: 1fr;
  }
}
</style>
