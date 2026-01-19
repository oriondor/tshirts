<script setup lang="ts">
import type { ProductType } from "~/types/products";

interface Props {
  design: any;
  properties: Record<string, string>;
}

const props = defineProps<Props>();

const { getImagePath } = useDesign(
  props.design.productType as ProductType,
  props.design.id,
);
</script>

<template>
  <div v-if="design" class="item-preview">
    <img :src="getImagePath(properties['design-color'] as string)" />
    <div class="item-props">
      <orio-view-text type="title" size="small">
        {{ design.name }}
      </orio-view-text>
      <orio-view-text type="subtitle" size="small">
        {{ properties["design-color"] }} / {{ properties.size }} /
        {{ properties["t-shirt-color"] }}
      </orio-view-text>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-preview {
  height: 100%;
  display: flex;
  align-items: center;

  img {
    height: 100%;
  }

  .item-props {
    display: flex;
    flex-direction: column;
  }
}
</style>
