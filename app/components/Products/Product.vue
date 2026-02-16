<script setup lang="ts">
export interface ProductProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  available: boolean;
}

const props = defineProps<ProductProps>();

const image = computed(() => `/products/${props.id}/preview.png`);
</script>

<template>
  <card @flip-complete="navigateTo(`/product/${id}`)">
    <img :src="image" />
    <orio-view-text type="title" size="large">{{ name }}</orio-view-text>
    <orio-button> CHECK COLLECTIONS </orio-button>
  </card>
</template>
