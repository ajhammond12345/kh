<script setup lang="ts">
defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div class="kad-overlay" @click.self="emit('close')">
      <div class="kad-dialog" role="dialog" aria-modal="true" :aria-label="title">
        <div class="kad-head">
          <div class="kad-title">{{ title }}</div>
          <button class="kad-close" aria-label="Close" @click="emit('close')">&times;</button>
        </div>
        <div class="kad-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.kad-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgb(22 26 34 / 0.58);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 8vh 20px 40px;
  overflow-y: auto;
}
.kad-dialog {
  width: min(680px, 100%);
  background: var(--paper-2);
  box-shadow: var(--shadow-3);
  border-radius: 10px;
  overflow: hidden;
}
.kad-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--hairline);
}
.kad-title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 22px;
  color: var(--ink);
}
.kad-close {
  background: transparent;
  border: 0;
  font-size: 26px;
  line-height: 1;
  color: var(--ink-3);
  cursor: pointer;
}
.kad-body {
  padding: 24px;
}
</style>
