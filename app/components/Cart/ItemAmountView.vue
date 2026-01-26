<script setup lang="ts">
const { formatDecimal } = useDecimalFormatter();

interface Props {
  total: number;
}

defineProps<Props>();
</script>

<template>
  <client-only>
    <orio-view-text type="italics" size="large" class="price">
      €{{ formatDecimal(total) }}
    </orio-view-text>
  </client-only>
</template>

<style scoped>
.price {
  text-align: center;
  min-width: 7rem;
  justify-content: center;
}
</style>
