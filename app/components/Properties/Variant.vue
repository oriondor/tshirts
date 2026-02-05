<script setup lang="ts">
interface Props {
  design: any;
}
const props = defineProps<Props>();

const { availableVariants } = useDesign(
  props.design.productId,
  props.design.id,
);
</script>

<template>
  <properties-switch-select
    :options="availableVariants"
    v-bind="{ ...props, ...$attrs }"
  />
</template>

<style scoped></style>
