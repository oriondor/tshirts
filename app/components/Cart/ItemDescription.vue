<script setup lang="ts">
import type { ProductId } from "~/types/products";
import { designLinkFromCartItem } from "~/utils/designLink";

interface Props {
  design: any;
  properties: Record<string, string | File[]>;
}

const props = defineProps<Props>();

const { getImagePath } = useDesign(
  props.design.productId as ProductId,
  props.design.id,
);

const productLink = computed(() =>
  designLinkFromCartItem(props.design.productId, props.design.id, props.properties),
);
</script>

<template>
  <nuxt-link v-if="design" :to="productLink" class="item-preview">
    <img :src="getImagePath(properties.variant as string)" />
    <div class="item-props">
      <orio-view-text type="title" size="small">
        {{ design.name }}
      </orio-view-text>
      <orio-view-text type="subtitle" size="small">
        {{ properties.variant }} / {{ properties.size }} /
        {{ properties["product-color"] }}
      </orio-view-text>
    </div>
  </nuxt-link>
</template>

<style scoped lang="scss">
.item-preview {
  height: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }

  img {
    height: 100%;
  }

  .item-props {
    display: flex;
    flex-direction: column;
  }
}
</style>
