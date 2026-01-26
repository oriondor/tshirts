<script setup lang="ts">
const { items, removeItem, isLoaded, load, total } = useCart();

const { createOrder } = useCheckout();

onMounted(load);
</script>

<template>
  <orio-animated-container v-if="isLoaded" direction="column">
    <cart-item
      v-for="(item, index) in items"
      :key="item.id"
      v-model="items[index]"
      @remove="removeItem(index)"
    />
    <div v-if="!items.length" class="empty">Your cart is empty</div>
  </orio-animated-container>
  <div v-else>Loading...</div>
  <Footer>
    <div class="subtotal">
      <orio-view-text type="title">Subtotal:</orio-view-text>
      <cart-item-amount-view :total />
      <orio-button @click="createOrder(items)">CHECKOUT</orio-button>
    </div>
  </Footer>
</template>

<style scoped>
.subtotal {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
