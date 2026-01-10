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
  <div class="designs">
    <designs-design
      v-for="design in designs"
      :key="design"
      :type="type"
      :name="design"
    />
  </div>
</template>

<style scoped>
.designs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 3rem;
}
</style>
