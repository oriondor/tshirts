<script setup lang="ts">
import type { ProductTypes } from "~/types/products";

const route = useRoute();
const type = computed(() => route.params.name as ProductTypes);
</script>

<template><designs :type /></template>

<style scoped></style>
