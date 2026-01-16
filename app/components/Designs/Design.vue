<script setup lang="ts">
interface Props {
  type: "t-shirt" | "cup";
  id: string;
  name: string;
  images: Record<string, string>;
}

const props = defineProps<Props>();

const overlayThreshold = 0.4;
const topMargin = "35%";

const baseProductImage = computed(() => `/products/${props.type}.png`);
const designImage = computed(
  () => `/designs/${props.type}/${props.id}/${Object.values(props.images)[0]}`
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
  top: v-bind("topMargin");
  width: v-bind("overlayThreshold * 100 + '%'");
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
