<script setup lang="ts">
import { isPrerenderedDesign, type Design } from "~/assets/configs/designs";
import type { ProductId } from "~/types/products";

const { design } = defineProps<{ design: Design }>();

const { formatDecimal } = useDecimalFormatter();

const { getBaseImage, getPrerenderedImagePath } = useDesign(
  design.productId as ProductId,
  design.id,
);

const isPrerendered = isPrerenderedDesign(design);

const thumbnail = computed(() => {
  if (isPrerendered) {
    return getPrerenderedImagePath(design.colors[0], design.placements[0]);
  }
  const firstVariant = Object.keys(
    (design as { images: Record<string, string> }).images,
  )[0];
  return `/designs/${design.productId}/${design.id}/${(design as { images: Record<string, string> }).images[firstVariant]}`;
});
</script>

<template>
  <nuxt-link
    :to="`/product/${design.productId}/design/${design.id}`"
    class="upsell-card"
  >
    <img :src="thumbnail" :alt="design.name" class="upsell-thumbnail" />
    <div class="upsell-info">
      <orio-view-text type="title" size="small">
        {{ design.name }}
      </orio-view-text>
      <client-only>
        <orio-view-text type="subtitle" size="small" class="upsell-price">
          €{{ formatDecimal(design.price) }}
        </orio-view-text>
      </client-only>
    </div>
  </nuxt-link>
</template>

<style scoped>
.upsell-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 12rem;
  max-width: 12rem;
  scroll-snap-align: start;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.upsell-card:hover {
  opacity: 0.8;
}

.upsell-thumbnail {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--border-radius-md, 0.5rem);
}

.upsell-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.upsell-price {
  opacity: 0.6;
}
</style>
