<script setup lang="ts">
import { designs } from "~/assets/configs/designs";
import type { ProductType } from "~/types/products";

const route = useRoute();
const productType = route.params.productType as ProductType;
const designId = route.params.designId as string;

const properties = ref<Record<string, string>>({});

const design = computed(() =>
  designs[productType].find(({ id }) => id === designId)
);
</script>

<template>
  <div class="design" v-if="design">
    <span class="item-images">Image</span>
    <div class="item-information">
      <orio-view-text type="title" size="large">
        {{ design.name }}
      </orio-view-text>
      <orio-view-text type="subtitle">{{ design.description }}</orio-view-text>
      <Properties v-model="properties" :design :product-type />
    </div>
  </div>
</template>

<style scoped>
.design {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-block: 2rem;
  padding-inline: 1rem;
}
.item-information {
  display: flex;
  flex-direction: column;
}
</style>
