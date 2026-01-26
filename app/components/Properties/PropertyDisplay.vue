<script setup lang="ts">
interface Props {
  label: string;
  value: string;
}

defineProps<Props>();
</script>

<template>
  <div class="property-display">
    <span class="label">{{ label }}</span>
    <span class="value">{{ value }}</span>
  </div>
</template>

<style scoped>
.property-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.label {
  color: var(--color-muted);
  font-size: 0.875rem;
}

.value {
  font-weight: 500;
}
</style>
