<script setup lang="ts">
import { isCanvasDesign } from "~/assets/configs/designs";

interface Props {
  design: any;
}
const props = defineProps<Props>();

const modelValue = defineModel<string>();

const sides = computed(() => {
  if (!isCanvasDesign(props.design) || !props.design.canvas) return [];
  return props.design.canvas.sides.map((s: any) => s.label);
});

onMounted(() => {
  if (!modelValue.value || !sides.value.includes(modelValue.value)) {
    modelValue.value = sides.value[0];
  }
});
</script>

<template>
  <properties-switch-select
    v-model="modelValue"
    :options="sides"
    v-bind="{ ...props, ...$attrs }"
  />
</template>
