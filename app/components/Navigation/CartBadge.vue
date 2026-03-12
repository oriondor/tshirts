<script setup lang="ts">
const { count } = useCart();

const badgeBump = ref(false);
watch(count, (newVal, oldVal) => {
  if (newVal > 0 && newVal !== oldVal) {
    badgeBump.value = false;
    nextTick(() => { badgeBump.value = true; });
  }
});
</script>

<template>
  <orio-badge type="pill" :hidden="!count" :class="{ 'badge-bump': badgeBump }" @animationend="badgeBump = false">
    {{ count }}
    <template #wrapping>
      <orio-nav-button
        variant="subdued"
        icon="shopping-cart"
        aria-label="Cart"
        @click="navigateTo('/cart')"
      />
    </template>
  </orio-badge>
</template>

<style scoped>
:deep(.badge.positioned) {
  animation: badge-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-bump :deep(.badge.positioned) {
  animation: badge-bump 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badge-bump {
  0%   { transform: translate(50%, -50%) scale(1); }
  50%  { transform: translate(50%, -50%) scale(1.5); }
  100% { transform: translate(50%, -50%) scale(1); }
}

@keyframes badge-pop-in {
  from {
    transform: translate(50%, -50%) scale(0) rotate(-180deg);
    opacity: 0;
  }
  to {
    transform: translate(50%, -50%) scale(1) rotate(0deg);
  }
}
</style>
