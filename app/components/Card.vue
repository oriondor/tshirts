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
    :style="{ '--rotate': `${Math.floor(Math.random() * 101) - 50}deg` }"
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
  gap: 0.5rem;
  cursor: pointer;
}

.card:hover :deep(img) {
  opacity: 0.85;
}

.card.flipping {
  animation: flipAndScale 0.3s ease-in-out forwards !important;
  z-index: 1000;
}

@keyframes flipAndScale {
  0% {
    transform: rotateZ(0deg) scale(0.2);
    opacity: 1;
  }
  100% {
    transform: rotateZ(var(--rotate)) scale(2);
    opacity: 0;
  }
}

:deep(img) {
  max-width: 100%;
  aspect-ratio: 1/1;
  height: 100%;
  transition: opacity 0.2s ease;
}
</style>
