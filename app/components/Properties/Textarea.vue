<script setup lang="ts">
const modelValue = defineModel<string>();
</script>

<template>
  <orio-textarea v-model="modelValue" layout="inner" />
</template>

<style scoped></style>
