<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

const state = useLocalStorage("scatter-hint-state", true);
const dismissed = ref(true);

function dismiss() {
  state.value = false;
  dismissed.value = true;
}

const visible = computed(() => state.value && !dismissed.value);

onMounted(() => {
  dismissed.value = !state.value;
});

defineExpose({ dismiss });
</script>

<template>
  <Transition name="hint">
    <div v-if="visible" class="scatter-hint" @click="dismiss">
      <span class="hint-icon">&#8690;</span>
      <p>Scroll to explore. Pinch or Ctrl+scroll to zoom.</p>
      <p>Tap a shirt to pick it up.</p>
      <small>Click anywhere to dismiss</small>
    </div>
  </Transition>
</template>

<style scoped>
.scatter-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: var(--color-bg, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  text-align: center;
  pointer-events: auto;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.hint-icon {
  font-size: 1.6rem;
  display: block;
  margin-bottom: 0.25rem;
}

.scatter-hint p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
}

.scatter-hint small {
  opacity: 0.4;
  font-size: 0.75rem;
}

.hint-enter-active,
.hint-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}
</style>
