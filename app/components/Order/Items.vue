<script setup lang="ts">
import type { OrderItem } from "~/composables/useCheckout";

interface Props {
  items: OrderItem[];
  currency: string;
}

defineProps<Props>();

const { t } = useI18n();
</script>

<template>
  <div class="order-items">
    <orio-view-text type="title" class="section-title">{{ t('orders.sectionItems') }}</orio-view-text>
    <order-item-card v-for="item in items" :key="item.id" :item :currency />
  </div>
</template>
