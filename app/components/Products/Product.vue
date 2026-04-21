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

const { t } = useI18n();
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
    <orio-view-text type="title" size="medium" class="title">
      {{ name }}
    </orio-view-text>
    <client-only>
      <orio-view-text type="subtitle" class="product-price">
        {{ t("product.from") }} €{{ formatDecimal(minPrice) }}
      </orio-view-text>
    </client-only>
  </card>
</template>

<style scoped>
img {
  object-fit: cover;
}
.title {
  text-transform: uppercase;
}
.product-price {
  opacity: 0.6;
}
</style>
