<script setup lang="ts">
const { items, removeItem } = useCart();
</script>

<template>
  <orio-animated-container direction="column">
    <cart-item
      v-for="(item, index) in items"
      :key="item.id"
      v-model="items[index]"
      @remove="removeItem(index)"
    />
  </orio-animated-container>
</template>

<style scoped></style>
