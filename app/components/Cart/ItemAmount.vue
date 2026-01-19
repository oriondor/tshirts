<script setup lang="ts">
const { formatDecimal } = useDecimalFormatter();

interface Props {
  price: number;
}

const props = defineProps<Props>();

// Quantity
const modelValue = defineModel<number>({ default: 0 });

const subtotal = computed(() => modelValue.value * (props.price ?? 0));
</script>

<template>
  <div class="item-amount">
    <orio-number-input-horizontal
      v-model="modelValue"
      :min="1"
      :max="100"
      class="amount-field"
    />
    <client-only>
      <orio-view-text type="italics" size="large" class="total-price">
        €{{ formatDecimal(subtotal) }}
      </orio-view-text>
    </client-only>
    <slot name="actions" />
  </div>
</template>

<style scoped>
.item-amount {
  display: flex;
  align-items: center;
}

.amount-field {
  max-width: 6rem;
}

.total-price {
  min-width: 8rem;
}
</style>
