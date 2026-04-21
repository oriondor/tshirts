<script setup lang="ts">
import type { ProductId } from "~/types/products";

definePageMeta({
  middleware: "single-design-redirect",
});

const route = useRoute();
const productId = computed(() => route.params.productId as ProductId);
</script>

<template><designs :productId /></template>

<style scoped></style>
