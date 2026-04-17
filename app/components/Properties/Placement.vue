<script setup lang="ts">
interface Props {
  design: any;
}
const props = defineProps<Props>();

const { availablePlacements } = useDesign(
  props.design.productId,
  props.design.id,
);

const capitalizedPlacements = computed(() =>
  availablePlacements.value.map((p) => p.charAt(0).toUpperCase() + p.slice(1)),
);
</script>

<template>
  <properties-switch-select
    :options="capitalizedPlacements"
    v-bind="{ ...props, ...$attrs }"
  />
</template>
