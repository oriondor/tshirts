<script setup lang="ts">
interface Props {
  base: string;
  overlay: string;
  params: {
    topMargin: string;
    leftMargin: string;
    overlayThreshold: number;
  };
}

defineProps<Props>();
</script>

<template>
  <div class="overlay-image">
    <img class="base" :src="base" />
    <img class="overlay" :src="overlay" />
  </div>
</template>

<style scoped>
.overlay-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.base {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.overlay {
  position: absolute;
  top: v-bind("params.topMargin");
  left: v-bind("params.leftMargin");
  width: v-bind("params.overlayThreshold * 100 + '%'");
  height: auto;
  object-fit: contain;
}
</style>
