<script setup lang="ts">
export interface ProductProps {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  available: boolean;
}

defineProps<ProductProps>();
</script>

<template>
  <card @click="navigateTo(`/product/${id}`)">
    <img :src="image" />
    <orio-view-text type="title" size="large">{{ name }}</orio-view-text>
    <orio-button> CHECK COLLECTIONS </orio-button>
  </card>
</template>
