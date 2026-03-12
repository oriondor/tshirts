<script setup lang="ts">
interface Props {
  design: any;
}
const props = defineProps<Props>();

const { availableColors } = useDesign(props.design.productId, props.design.id);

const capitalizedColors = computed(() =>
  availableColors.value.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
);
</script>

<template>
  <properties-switch-select
    :options="capitalizedColors"
    v-bind="{ ...props, ...$attrs }"
  />
</template>
