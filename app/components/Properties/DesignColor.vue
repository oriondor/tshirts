<script setup lang="ts">
import { useDesignColor } from "~/assets/composables/useDesignColor";

interface Props {
  design: any;
}
const props = defineProps<Props>();

const { availableColors } = useDesignColor(props.design);
</script>

<template>
  <properties-switch-select
    :options="availableColors"
    v-bind="{ ...props, ...$attrs }"
  />
</template>

<style scoped></style>
