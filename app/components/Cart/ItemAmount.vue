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
    <cart-item-amount-view :total class="amount-view" />
    <div class="actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.item-amount {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex: 1;
}

.amount-field {
  width: 5rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

@media (max-width: 768px) {
  .item-amount {
    max-width: 13rem;
  }

  .amount-view {
    flex: 1 1 0;
  }
}
</style>
