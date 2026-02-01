<script setup lang="ts">
import {
  statusLabels,
  statusColors,
  formatDate,
} from "~/composables/useCheckout";

interface Props {
  id: string;
  status: string;
  createdAt: string;
}

defineProps<Props>();
</script>

<template>
  <div class="order-header">
    <div class="order-title">
      <orio-view-text type="title" size="large">
        Order #{{ id.slice(0, 8) }}
      </orio-view-text>
      <span
        class="order-status"
        :style="{ backgroundColor: statusColors[status] }"
      >
        {{ statusLabels[status] }}
      </span>
    </div>
    <orio-view-text type="subtitle">
      Placed on {{ formatDate(createdAt) }}
    </orio-view-text>
    <slot />
  </div>
</template>

<style scoped>
.order-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.order-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  color: white;
  font-size: 0.875rem;
}
</style>
