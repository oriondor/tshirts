<script setup lang="ts">
import { products } from "@/assets/configs/products";
</script>

<template>
  <container>
    <products-product
      v-for="product in products"
      :key="product.id"
      v-bind="product"
    />
  </container>
</template>

<style scoped></style>
