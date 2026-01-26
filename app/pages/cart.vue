<script setup lang="ts">
const { items, removeItem, isLoaded, load, total, clear } = useCart();

const { createOrder } = useCheckout();

const { loggedIn } = useUserSession();

async function processOrder() {
  const order = await createOrder(items.value);
  if (!order) return;
  clear();
  navigateTo(`/orders/${order.id}`);
}

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
      <orio-button v-if="loggedIn" icon="shopping-bag" @click="processOrder">
        CHECKOUT
      </orio-button>
      <orio-button
        v-else
        @click="navigateTo('/profile')"
        variant="secondary"
        icon="user"
      >
        LOG IN TO CHECKOUT
      </orio-button>
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
