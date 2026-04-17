<script setup lang="ts">
import { isPrerenderedDesign } from "~/assets/configs/designs";

interface Props {
  design: any;
}
const props = defineProps<Props>();

const { availableColors, availablePlacements, getPrerenderedImagePath } =
  useDesign(props.design.productId, props.design.id);

const capitalizedColors = computed(() =>
  availableColors.value.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
);

function getPreviewImage(colorCapitalized: string) {
  if (!isPrerenderedDesign(props.design)) return "";
  const color = colorCapitalized.toLowerCase();
  const placement =
    props.design.defaultPlacement || availablePlacements.value[0] || "";
  return getPrerenderedImagePath(color, placement);
}
</script>

<template>
  <properties-switch-select
    :options="capitalizedColors"
    v-bind="{ ...props, ...$attrs }"
  >
    <template #default="{ option }">
      <NuxtImg
        v-if="getPreviewImage(option)"
        :src="getPreviewImage(option)"
        :alt="option"
        width="24"
        height="24"
        format="webp"
        quality="100"
        class="color-preview"
      />
    </template>
  </properties-switch-select>
</template>

<style scoped>
.color-preview {
  object-fit: cover;
}
</style>
