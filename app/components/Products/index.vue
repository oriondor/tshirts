<script setup lang="ts">
import { products } from "@/assets/configs/products";
</script>

<template>
  <orio-animated-container v-slot="{ play }">
    <products-product
      v-for="(product, i) in products.filter(({ available }) => !!available)"
      :key="product.id"
      v-bind="product"
      v-reveal="{ delay: i * 80 }"
      @mouseenter="play"
    />
  </orio-animated-container>
</template>

<style scoped></style>
