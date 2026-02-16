<script setup lang="ts">
import { defaultImageProps, type ImageProps } from "~/assets/configs/designs";
import type { ProductId } from "~/types/products";

interface Props {
  productId: string;
  id: string;
  name: string;
  images: Record<string, string>;
  imageProps?: Record<string, ImageProps>;
}

const props = defineProps<Props>();

const { getBaseImage } = useDesign(props.productId as ProductId, props.id);

const firstColor = computed(() => Object.keys(props.images)[0]);

const currentImageProps = computed(() => ({
  ...defaultImageProps,
  ...props.imageProps?.[firstColor.value],
}));

// Variant is the key of the first image
const variant = computed(() => Object.keys(props.images)[0]!);

const designImage = computed(
  () =>
    `/designs/${props.productId}/${props.id}/${props.images[variant.value]}`,
);
</script>

<template>
  <card
    class="design-card"
    @flip-complete="navigateTo(`/product/${productId}/design/${id}`)"
  >
    <div class="image-container">
      <div class="main-image">
        <designs-overlay-image
          :overlay="designImage"
          :base="getBaseImage(variant)"
          :params="currentImageProps"
        />
      </div>
      <img class="design-image" :src="designImage" />
    </div>
    <orio-view-text type="title" size="large">{{ name }}</orio-view-text>
    <orio-button> CUSTOMIZE </orio-button>
  </card>
</template>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
}

.main-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.1s ease-in-out;
  width: 100%;
}

.design-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
  pointer-events: none;
}

.design-card:hover .main-image {
  opacity: 0;
}

.design-card:hover .design-image {
  opacity: 1;
}
</style>
