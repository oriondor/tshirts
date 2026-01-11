<script setup lang="ts">
const isFlipping = ref(false);

const emit = defineEmits<{
  flipComplete: [];
}>();

function handleClick() {
  isFlipping.value = true;
}

function onAnimationEnd(event: AnimationEvent) {
  // Only respond to our flip animation, not inherited ones
  if (isFlipping.value && event.animationName.includes("flipAndScale")) {
    isFlipping.value = false;
    emit("flipComplete");
  }
}
</script>

<template>
  <div
    class="card"
    :class="{ flipping: isFlipping }"
    @click="handleClick"
    @animationend="onAnimationEnd"
  >
    <slot />
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
  width: 23rem;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-bg-1);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.card:hover {
  background-color: var(--color-bg-2);
}

.card.flipping {
  animation: flipAndScale 0.3s ease-in-out forwards !important;
}

@keyframes flipAndScale {
  0% {
    transform: rotateZ(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotateZ(250deg) scale(9);
    opacity: 0;
  }
}

:deep(img) {
  max-width: 100%;
  border-radius: var(--border-radius-lg);
}
</style>
