<script setup lang="ts">
import { products } from "@/assets/configs/products";
</script>

<template>
  <div class="products">
    <products-product
      v-for="product in products"
      :key="product.id"
      v-bind="product"
    />
  </div>
</template>

<style scoped>
.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
