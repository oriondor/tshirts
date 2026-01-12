<script setup lang="ts">
import type { ProductType } from "~/types/products";

const route = useRoute();
const type = computed(() => route.params.productType as ProductType);
</script>

<template><designs :type /></template>

<style scoped></style>
