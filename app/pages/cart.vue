<script setup lang="ts">
const { items, removeItem } = useCart();
</script>

<template>
  <container direction="column">
    <cart-item
      v-for="(item, index) in items"
      :key="item.id"
      v-model="items[index]"
      @remove="removeItem(index)"
    />
  </container>
</template>

<style scoped></style>
