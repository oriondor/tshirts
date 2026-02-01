<script setup lang="ts">
interface Props {
  notes: string;
}

defineProps<Props>();
</script>

<template>
  <div class="order-notes">
    <orio-view-text type="title" class="section-title">Notes</orio-view-text>
    <orio-view-text type="text">{{ notes }}</orio-view-text>
  </div>
</template>

<style scoped>
.order-notes {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
}

.section-title {
  margin-bottom: 1rem;
}
</style>
