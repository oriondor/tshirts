<script setup lang="ts">
import { products } from "@/assets/configs/products";
</script>

<template>
  <orio-animated-container v-slot="{ play }">
    <products-product
      v-for="product in products"
      :key="product.id"
      v-bind="product"
      @mouseenter="play"
    />
  </orio-animated-container>
</template>

<style scoped></style>
