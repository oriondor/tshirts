<script setup lang="ts">
interface Props {
  price: number;
}

const props = defineProps<Props>();

// Quantity
const modelValue = defineModel<number>({ default: 0 });

const total = computed(() => modelValue.value * (props.price ?? 0));
</script>

<template>
  <div class="item-amount">
    <orio-number-input-horizontal
      v-model="modelValue"
      :min="1"
      :max="100"
      class="amount-field"
    />
    <cart-item-amount-view :total />
    <slot name="actions" />
  </div>
</template>

<style scoped>
.item-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.amount-field {
  max-width: 6rem;
}
</style>
