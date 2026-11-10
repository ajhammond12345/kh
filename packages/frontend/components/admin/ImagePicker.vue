<script setup lang="ts">
const file = defineModel<File | null>({ required: true })
const props = withDefaults(defineProps<{ id?: string; existingUrl?: string | null }>(), {
  id: 'artwork-image',
  existingUrl: null,
})

const error = ref('')
const dragging = ref(false)
const preview = ref<string | null>(null)

watch(file, (f, _, onCleanup) => {
  if (!f) {
    preview.value = null
    return
  }
  const url = URL.createObjectURL(f)
  preview.value = url
  onCleanup(() => URL.revokeObjectURL(url))
}, { immediate: true })

function choose(f: File | undefined) {
  error.value = ''
  if (!f) return
  if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) {
    error.value = 'Please choose a JPEG, PNG or WebP photo.'
    return
  }
  if (f.size > 25 * 1024 * 1024) {
    error.value = 'That photo is over 25 MB. Please choose a smaller one.'
    return
  }
  file.value = f
}

function onDrop(e: DragEvent) {
  dragging.value = false
  choose(e.dataTransfer?.files?.[0])
}
</script>

<template>
  <div>
    <label
      :for="props.id"
      class="kip-drop"
      :class="{ 'kip-drop--active': dragging, 'kip-drop--filled': preview || existingUrl }"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <img v-if="preview || existingUrl" :src="preview || existingUrl || ''" alt="" class="kip-preview" />
      <span class="kip-text">
        <strong>{{ preview ? file?.name : existingUrl ? 'Photo of the work' : 'Choose a photo' }}</strong>
        <span v-if="!existingUrl">{{ preview ? 'Click to choose a different one' : 'or drag it here. JPEG, PNG or WebP, up to 25 MB' }}</span>
      </span>
    </label>
    <input
      v-if="!existingUrl"
      :id="props.id"
      type="file"
      class="kip-input"
      :accept="ACCEPTED_IMAGE_TYPES.join(',')"
      @change="choose(($event.target as HTMLInputElement).files?.[0])"
    />
    <p v-if="error" class="kha-error kip-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.kip-drop {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 1.5px dashed rgb(22 26 34 / 0.22);
  border-radius: 10px;
  background: #FFFDF8;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.kip-drop:hover,
.kip-drop--active {
  border-color: var(--sienna);
  background: var(--sienna-wash);
}
.kip-drop--filled {
  border-style: solid;
}
.kip-preview {
  width: 72px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  flex: none;
  background: var(--parchment);
}
.kip-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--ink-3);
  min-width: 0;
  overflow-wrap: anywhere;
}
.kip-text strong {
  font-size: 14px;
  color: var(--ink);
  font-weight: 600;
}
.kip-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.kip-error {
  margin: 8px 0 0;
}
</style>
