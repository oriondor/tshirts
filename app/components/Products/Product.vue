<script setup lang="ts">
import { designs } from "~/assets/configs/designs";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  available: boolean;
}

const props = defineProps<ProductProps>();

const { formatDecimal } = useDecimalFormatter();

const image = computed(() => `/products/${props.id}/preview.png`);

const minPrice = computed(() => {
  const productDesigns = designs[props.id] ?? [];
  if (!productDesigns.length) return props.basePrice;
  return Math.min(...productDesigns.map((d) => d.price));
});
</script>

<template>
  <card @flip-complete="navigateTo(`/product/${id}`)">
    <img :src="image" />
    <orio-view-text type="title" size="large">{{ name }}</orio-view-text>
    <client-only>
      <orio-view-text type="subtitle" class="product-price">
        From €{{ formatDecimal(minPrice) }}
      </orio-view-text>
    </client-only>
  </card>
</template>

<style scoped>
.product-price {
  opacity: 0.6;
}
</style>
