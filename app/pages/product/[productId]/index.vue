<script setup lang="ts">
import type { ProductId } from "~/types/products";

definePageMeta({
  middleware: "single-design-redirect",
  ssr: false,
});

const route = useRoute();
const productId = computed(() => route.params.productId as ProductId);
</script>

<template>
  <div class="scatter-page">
    <designs-scatter-view :productId />
  </div>
</template>

<style scoped>
.scatter-page {
  height: calc(100dvh - var(--nav-height));
}
</style>
