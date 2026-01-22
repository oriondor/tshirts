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
</script>

<template>
  <div v-if="design && modelValue" class="cart-item">
    <cart-item-description :design :properties="modelValue.properties" />
    <cart-item-amount v-model="modelValue.quantity" :price="design.price">
      <template #actions>
        <orio-button variant="subdued" @click="emit('remove')">
          <template #icon>
            <orio-icon name="delete" :size="24" color="var(--color-danger)" />
          </template>
        </orio-button>
      </template>
    </cart-item-amount>
  </div>
</template>

<style scoped>
.cart-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 0.5rem 1rem;
  height: 8rem;
}
</style>
