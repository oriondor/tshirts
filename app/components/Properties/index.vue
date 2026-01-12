<script setup lang="ts">
import type { ProductType } from "~/types/products";
import { products } from "~/assets/configs/products";

const propertyModules = import.meta.glob<{ default: any }>("./*.vue", {
  eager: true,
});

interface Props {
  productType: ProductType;
  design: any;
}
const props = defineProps<Props>();
const modelValue = defineModel<Record<string, string>>({ default: {} });

const productConfig = computed(() => {
  return products.find((p) => p.id === props.productType);
});

const propertyComponents = computed(() => {
  const properties = productConfig.value?.properties || [];
  // Filter out invalid properties without a component
  return properties
    .filter((prop) => prop.component)
    .map((prop) => {
      const { component, name, ...componentProps } = prop;
      const resolvedComponent = propertyModules[`./${component}.vue`]?.default;
      return { component: resolvedComponent, name, props: componentProps };
    });
});
</script>

<template>
  <div class="properties">
    <component
      v-for="(property, index) in propertyComponents"
      v-model="modelValue[property.name]"
      :key="`${property.name}-${index}`"
      :is="property.component"
      :design="design"
      v-bind="property.props"
    />
  </div>
</template>

<style scoped></style>
