<script setup lang="ts">
import { type OrderItem, formatPrice } from "~/composables/useCheckout";

interface Props {
  item: OrderItem;
  currency: string;
}

const props = defineProps<Props>();

const { getImageUrl } = useCheckout();

const propertyLabels: Record<string, string> = {
  size: "Size",
  productColor: "Color",
  designColor: "Design Color",
  name: "Name",
  secondaryText: "Secondary Text",
};

function getItemProperties() {
  return Object.entries(propertyLabels)
    .filter(([key]) => props.item[key as keyof OrderItem])
    .map(([key, label]) => ({
      label,
      value: props.item[key as keyof OrderItem] as string,
    }));
}

function getItemSubtotal(): string {
  const subtotal = parseFloat(props.item.unitPrice) * props.item.quantity;
  return formatPrice(subtotal.toFixed(2), props.currency);
}
</script>

<template>
  <div class="order-item-card">
    <div class="item-info">
      <div class="item-header">
        <orio-view-text type="title">
          {{ item.productId }}
        </orio-view-text>
        <orio-view-text type="subtitle" size="small">
          Design: {{ item.designId }}
        </orio-view-text>
      </div>

      <div class="item-properties">
        <properties-property-display
          v-for="prop in getItemProperties()"
          :key="prop.label"
          :label="prop.label"
          :value="prop.value"
        />
      </div>

      <div v-if="item.specialRequest" class="special-request">
        <orio-view-text type="subtitle" size="small">
          Special Request
        </orio-view-text>
        <orio-view-text type="text">{{ item.specialRequest }}</orio-view-text>
      </div>

      <div class="item-pricing">
        <orio-view-text type="subtitle">
          {{ item.quantity }} x {{ formatPrice(item.unitPrice, currency) }}
        </orio-view-text>
        <orio-view-text type="title">{{ getItemSubtotal() }}</orio-view-text>
      </div>
    </div>

    <div v-if="item.images && item.images.length > 0" class="item-images">
      <orio-view-text type="subtitle" size="small">
        Uploaded Images
      </orio-view-text>
      <div class="images-grid">
        <a
          v-for="image in item.images"
          :key="image.id"
          :href="getImageUrl(image.storagePath)"
          target="_blank"
          class="image-thumbnail"
        >
          <img
            :src="getImageUrl(image.storagePath)"
            :alt="image.originalFilename"
          />
          <orio-view-text type="subtitle" size="small" :line-clamp="1">
            {{ image.originalFilename }}
          </orio-view-text>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-item-card {
  padding: 1.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
  margin-bottom: 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-properties {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.special-request {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
}

.item-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.item-images {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.image-thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.image-thumbnail img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}
</style>
