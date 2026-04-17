<script setup lang="ts">
const modelValue = defineModel<string>();
</script>

<template>
  <orio-input v-model="modelValue" layout="inner" v-bind="$attrs" />
</template>

<style scoped></style>
