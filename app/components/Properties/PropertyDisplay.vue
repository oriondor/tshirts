<script setup lang="ts">
interface Props {
  label: string;
  value: string;
}

defineProps<Props>();
</script>

<template>
  <div class="property-display">
    <orio-view-text type="subtitle" size="small">{{ label }}</orio-view-text>
    <orio-view-text type="title" size="small">{{ value }}</orio-view-text>
  </div>
</template>

<style scoped>
.property-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}
</style>
