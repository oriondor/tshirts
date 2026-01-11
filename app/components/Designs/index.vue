<script setup lang="ts">
import type { ProductTypes } from "~/types/products";
import { designs as designsConfig } from "@/assets/configs/designs";

interface Props {
  type: ProductTypes;
}

const props = defineProps<Props>();

// Get designs for the current product type
const designs = computed(() => {
  return designsConfig[props.type] || [];
});
</script>

<template>
  <container>
    <designs-design
      v-for="design in designs"
      :key="design.name"
      :type
      v-bind="design"
    />
  </container>
</template>

<style scoped></style>
