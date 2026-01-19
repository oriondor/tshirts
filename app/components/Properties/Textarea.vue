<script setup lang="ts">
const modelValue = defineModel<string>();
</script>

<template>
  <orio-textarea v-model="modelValue" />
</template>

<style scoped></style>
