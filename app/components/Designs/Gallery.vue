<script setup lang="ts">
const activeImage = defineModel<string>("activeImage");

const { images = [] } = defineProps<{
  images?: string[];
}>();
</script>

<template>
  <div class="design-gallery">
    <orio-gallery-carousel
      v-model:active-image="activeImage"
      size=":500"
      :images
      appearance="minimal"
    >
      <template v-if="$slots.image" #image="{ image }">
        <slot name="image" :image />
      </template>
    </orio-gallery-carousel>
    <orio-gallery-carousel-preview
      v-model:active-image="activeImage"
      :images
    >
      <template v-if="$slots.image" #image="{ image }">
        <slot name="image" :image />
      </template>
    </orio-gallery-carousel-preview>
  </div>
</template>
