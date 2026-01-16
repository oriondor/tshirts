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

function getImageByColor(color: string) {
  const images = design.value?.images as Record<string, string> | undefined;
  return `/designs/${productType}/${designId}/${images?.[color]}`;
}

const currentImage = ref(
  getImageByColor(properties.value["design-color"] as string)
);

watch(
  () => properties.value["design-color"],
  () => {
    currentImage.value = getImageByColor(
      properties.value["design-color"] as string
    );
  }
);
</script>

<template>
  <div class="design" v-if="design">
    <orio-gallery-carousel
      v-model:active-image="currentImage"
      class="item-images"
      :images="
        Object.values(design.images).map(
          (image: string) => `/designs/${productType}/${designId}/${image}`
        )
      "
    />
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
  gap: 1.5rem;
  padding-block: 2rem;
  padding-inline: 1rem;
}
.item-information {
  display: flex;
  flex-direction: column;
}
</style>
