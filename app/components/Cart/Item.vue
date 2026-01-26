<script setup lang="ts">
import type { CartItem } from "~/types/cart";
import type { ProductType } from "~/types/products";

const emit = defineEmits<{
  remove: [];
}>();

const modelValue = defineModel<CartItem>();

const { design } = useDesign(
  modelValue.value!.productType as ProductType,
  modelValue.value!.designId,
);

const expanded = ref(false);
</script>

<template>
  <div v-if="design && modelValue" class="cart-item" :class="{ expanded }">
    <div class="cart-item-main">
      <cart-item-description :design :properties="modelValue.properties" />
      <cart-item-amount v-model="modelValue.quantity" :price="design.price">
        <template #actions>
          <orio-button variant="subdued" @click="expanded = !expanded">
            <template #icon>
              <orio-icon
                name="chevron-down"
                :size="24"
                :class="{ rotated: expanded }"
              />
            </template>
            Show more
          </orio-button>
          <orio-button variant="subdued" @click="emit('remove')">
            <template #icon>
              <orio-icon name="delete" :size="24" color="var(--color-danger)" />
            </template>
          </orio-button>
        </template>
      </cart-item-amount>
    </div>
    <div class="cart-item-details">
      <cart-properties-view
        :product-type="modelValue.productType as ProductType"
        :properties="modelValue.properties"
      />
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 0.5rem 1rem;
  overflow: hidden;
}

.cart-item-main {
  display: flex;
  justify-content: space-between;
  height: 7rem;
}

.cart-item-details {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.cart-item.expanded .cart-item-details {
  max-height: 30rem;
  transition: max-height 0.3s ease-in;
}

:deep(.rotated) {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

:deep(svg:not(.rotated)) {
  transition: transform 0.3s ease;
}
</style>
