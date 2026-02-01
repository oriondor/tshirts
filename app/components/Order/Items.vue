<script setup lang="ts">
import type { OrderItem } from "~/composables/useCheckout";

interface Props {
  items: OrderItem[];
  currency: string;
}

defineProps<Props>();
</script>

<template>
  <div class="order-items">
    <orio-view-text type="title" class="section-title">Items</orio-view-text>
    <order-item-card
      v-for="item in items"
      :key="item.id"
      :item="item"
      :currency="currency"
    />
  </div>
</template>
