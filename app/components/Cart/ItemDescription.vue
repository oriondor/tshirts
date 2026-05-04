<script setup lang="ts">
import type { ProductId } from "~/types/products";
import { designLinkFromCartItem } from "~/utils/designLink";

interface Props {
  design: any;
  properties: Record<string, string | File[]>;
}

const props = defineProps<Props>();

const { getImagePath, getPrerenderedImagePath, prerendered } = useDesign(
  props.design.productId as ProductId,
  props.design.id,
);

const productLink = computed(() =>
  designLinkFromCartItem(
    props.design.productId,
    props.design.id,
    props.properties,
  ),
);

const previewImage = computed(() => {
  if (prerendered.value) {
    const color = (
      (props.properties["product-color"] as string) || ""
    ).toLowerCase();
    const placement = (
      (props.properties.placement as string) || "front"
    ).toLowerCase();
    if (!color) return "";
    return getPrerenderedImagePath(color, placement);
  }
  return getImagePath(props.properties.variant as string);
});

const subtitle = computed(() => {
  const parts: string[] = [];
  if (props.properties.variant) parts.push(props.properties.variant as string);
  if (props.properties.placement)
    parts.push(props.properties.placement as string);
  if (props.properties.size) parts.push(props.properties.size as string);
  if (props.properties["product-color"])
    parts.push(props.properties["product-color"] as string);
  return parts.join(" / ");
});
</script>

<template>
  <nuxt-link v-if="design" :to="productLink" class="item-preview">
    <img :src="previewImage" />
    <div class="item-props">
      <orio-view-text type="title" size="small">
        {{ design.name }}
      </orio-view-text>
      <orio-view-text type="subtitle" size="small">
        {{ subtitle }}
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
