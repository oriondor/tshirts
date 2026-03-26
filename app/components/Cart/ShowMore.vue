<script setup lang="ts">
const expanded = defineModel();
</script>

<template>
  <orio-button variant="subdued" @click="expanded = !expanded" fill>
    <template #icon>
      <orio-icon
        name="chevron-down"
        :size="24"
        :class="{ rotated: expanded }"
      />
    </template>
    Show more
  </orio-button>
</template>

<style scoped></style>
