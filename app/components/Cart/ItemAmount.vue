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
  justify-content: center;
  flex-wrap: wrap;
}

.amount-field {
  max-width: 6rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

@media (max-width: 768px) {
  .amount-field {
    flex: 1 1 0;
    max-width: none;
  }

  .amount-view {
    flex: 1 1 0;
  }

  .actions {
    flex: 1 0 100%;
  }

  .actions :deep(button) {
    width: 100%;
  }
}
</style>
