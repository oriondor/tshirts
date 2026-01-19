<script setup lang="ts">
interface Props {
  design: any;
}
const props = defineProps<Props>();

const { availableColors } = useDesign(
  props.design.productType,
  props.design.id,
);
</script>

<template>
  <properties-switch-select
    :options="availableColors"
    v-bind="{ ...props, ...$attrs }"
  />
</template>

<style scoped></style>
