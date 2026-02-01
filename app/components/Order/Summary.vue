<script setup lang="ts">
import { formatPrice } from "~/composables/useCheckout";

interface Props {
  totalPrice: string;
  currency: string;
}

defineProps<Props>();
</script>

<template>
  <div class="order-summary">
    <div class="summary-row">
      <orio-view-text type="title" size="large">Total</orio-view-text>
      <orio-view-text type="title" size="large">
        {{ formatPrice(totalPrice, currency) }}
      </orio-view-text>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.order-summary {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid var(--color-border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}
</style>
