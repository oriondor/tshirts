<script setup lang="ts">
import {
  isPrerenderedDesign,
  defaultImageProps,
  type ImageProps,
  type Design,
} from "~/assets/configs/designs";
import type { ProductId } from "~/types/products";

const props = defineProps<{ design: Design }>();

const { formatDecimal } = useDecimalFormatter();

const { getBaseImage, getPrerenderedImagePath } = useDesign(
  props.design.productId as ProductId,
  props.design.id,
);

const isPrerendered = isPrerenderedDesign(props.design);

// Pre-rendered: show first color front, second color front on hover
const mainImage = computed(() => {
  if (!isPrerendered) return "";
  return getPrerenderedImagePath(
    props.design.colors[0],
    props.design.placements[0],
  );
});

const hoverImage = computed(() => {
  if (!isPrerendered) return "";
  const hoverColor = props.design.colors[1] ?? props.design.colors[0];
  return getPrerenderedImagePath(hoverColor, props.design.placements[0]);
});

// Overlay: keep existing behavior
const overlayDesign = computed(() => {
  if (isPrerendered) return null;
  return props.design as {
    images: Record<string, string>;
    imageProps?: Record<string, ImageProps>;
  };
});

const firstVariant = computed(() => {
  if (!overlayDesign.value) return "";
  return Object.keys(overlayDesign.value.images)[0];
});

const designImage = computed(() => {
  if (!overlayDesign.value) return "";
  return `/designs/${props.design.productId}/${props.design.id}/${overlayDesign.value.images[firstVariant.value]}`;
});

const currentImageProps = computed(() => ({
  ...defaultImageProps,
  ...overlayDesign.value?.imageProps?.[firstVariant.value],
}));
</script>

<template>
  <card
    class="design-card"
    @flip-complete="
      navigateTo(`/product/${design.productId}/design/${design.id}`)
    "
  >
    <!-- Pre-rendered: swap color on hover -->
    <div v-if="isPrerendered" class="image-container">
      <img class="main-image" :src="mainImage" />
      <img class="hover-image" :src="hoverImage" />
    </div>

    <!-- Overlay: existing behavior -->
    <div v-else class="image-container">
      <div class="main-image">
        <designs-overlay-image
          :overlay="designImage"
          :base="getBaseImage(firstVariant)"
          :params="currentImageProps"
        />
      </div>
      <img class="hover-image" :src="designImage" />
    </div>

    <orio-view-text type="title" size="large">{{ design.name }}</orio-view-text>
    <client-only>
      <orio-view-text type="subtitle">
        €{{ formatDecimal(design.price) }}
      </orio-view-text>
    </client-only>
  </card>
</template>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
}

.main-image {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.2s ease;
  width: 100%;
}

.hover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.design-card:hover .main-image {
  opacity: 0;
}

.design-card:hover .hover-image {
  opacity: 1;
}
</style>
