<script setup lang="ts">
import type { ProductType } from "~/types/products";
import { designs as designsConfig } from "@/assets/configs/designs";

interface Props {
  type: ProductType;
}

const props = defineProps<Props>();

// Get designs for the current product type
const designs = computed(() => {
  return designsConfig[props.type] || [];
});
</script>

<template>
  <orio-animated-container v-slot="{ play }">
    <designs-design
      v-for="design in designs"
      :key="design.name"
      :type
      v-bind="design"
      @mouseenter="play"
    />
  </orio-animated-container>
</template>

<style scoped></style>
