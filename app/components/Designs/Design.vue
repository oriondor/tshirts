<script setup lang="ts">
import {
  defaultImageProps,
  type ImageProps,
} from "~/assets/configs/designs";

interface Props {
  type: "t-shirt" | "cup";
  id: string;
  name: string;
  images: Record<string, string>;
  imageProps?: Record<string, ImageProps>;
}

const props = defineProps<Props>();

const firstColor = computed(() => Object.keys(props.images)[0]);

const currentImageProps = computed(() => ({
  ...defaultImageProps,
  ...props.imageProps?.[firstColor.value],
}));

const baseProductImage = computed(() => `/products/base-${props.type}.png`);
const designImage = computed(
  () => `/designs/${props.type}/${props.id}/${Object.values(props.images)[0]}`,
);
</script>

<template>
  <card
    class="design-card"
    @flip-complete="navigateTo(`/product/${type}/design/${id}`)"
  >
    <div class="image-container">
      <div class="main-image">
        <img class="base-image" :src="baseProductImage" />
        <img class="design-overlay" :src="designImage" />
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

.base-image {
  width: 100%;
  height: auto;
}

.design-overlay {
  position: absolute;
  top: v-bind("currentImageProps.topMargin");
  left: v-bind("currentImageProps.leftMargin");
  width: v-bind("currentImageProps.overlayThreshold * 100 + '%'");
  height: auto;
  object-fit: contain;
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
