<script setup lang="ts">
import type { ProductId } from "~/types/products";
import { designs as designsConfig } from "@/assets/configs/designs";

interface Props {
  productId: ProductId;
}

const props = defineProps<Props>();

// Get designs for the current product
const designs = computed(() => {
  return designsConfig[props.productId] || [];
});
</script>

<template>
  <orio-animated-container v-slot="{ play }">
    <designs-design
      v-for="design in designs"
      :key="design.name"
      v-bind="design"
      @mouseenter="play"
    />
  </orio-animated-container>
</template>

<style scoped></style>
