<script setup lang="ts">
const modelValue = defineModel<string>();
</script>

<template>
  <orio-input v-model="modelValue" v-bind="$attrs" />
</template>

<style scoped></style>
