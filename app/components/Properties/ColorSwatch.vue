<script setup lang="ts">
defineProps<{
  options: string[];
  label?: string;
}>();
</script>

<template>
  <properties-switch-select :options :label v-bind="$attrs">
    <template #default="{ option }">
      <span class="swatch" :style="{ backgroundColor: option }" />
    </template>
  </properties-switch-select>
</template>

<style scoped>
.swatch {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 1px solid var(--border-color, #e0e0e0);
}
</style>
