<script setup lang="ts">
import type { ProductType } from "~/types/products";
import { products } from "~/assets/configs/products";

interface Props {
  productType: ProductType;
  properties: Record<string, string | File[]>;
}

const props = defineProps<Props>();

const productConfig = computed(() => {
  return products.find((p) => p.id === props.productType);
});

const textProperties = computed(() => {
  const configs = productConfig.value?.properties || [];
  return configs
    .filter(
      (prop) => prop.component !== "FilesUpload" && props.properties[prop.name],
    )
    .map((prop) => ({
      label: prop.label,
      value: props.properties[prop.name] as string,
    }));
});

const files = computed(() => {
  const filesValue = props.properties.files;
  if (Array.isArray(filesValue)) {
    return filesValue as File[];
  }
  return [];
});
</script>

<template>
  <div class="properties-view">
    <properties-property-display
      v-for="prop in textProperties"
      :key="prop.label"
      :label="prop.label"
      :value="prop.value"
    />
    <div v-if="files.length" class="files-section">
      <span class="files-label">Uploaded images</span>
      <properties-files-upload :model-value="files" disabled />
    </div>
  </div>
</template>

<style scoped>
.properties-view {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0;
}

.files-section {
  margin-top: 0.5rem;
}

.files-label {
  color: var(--color-muted);
  font-size: 0.875rem;
}
</style>
