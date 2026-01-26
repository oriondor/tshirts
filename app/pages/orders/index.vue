<script setup lang="ts">
import {
  type Order,
  statusLabels,
  statusColors,
  formatDate,
  formatPrice,
} from "~/composables/useCheckout";

const { loggedIn } = useUserSession();
const { fetchOrders, loading, error } = useCheckout();
const orders = ref<Order[]>([]);

onMounted(async () => {
  if (loggedIn.value) {
    orders.value = await fetchOrders();
  }
});

watch(loggedIn, async (isLoggedIn) => {
  if (isLoggedIn) {
    orders.value = await fetchOrders();
  } else {
    orders.value = [];
  }
});
</script>

<template>
  <div class="orders-page">
    <div class="orders-container">
      <h1>My Orders</h1>

      <template v-if="!loggedIn">
        <div class="auth-required">
          <p>Please log in to view your orders.</p>
          <NuxtLink to="/profile" class="login-link">Go to Login</NuxtLink>
        </div>
      </template>

      <template v-else-if="loading">
        <div class="loading">Loading orders...</div>
      </template>

      <template v-else-if="error">
        <div class="error">{{ error }}</div>
      </template>

      <template v-else-if="orders.length === 0">
        <div class="empty">
          <p>You haven't placed any orders yet.</p>
          <NuxtLink to="/" class="shop-link">Start Shopping</NuxtLink>
        </div>
      </template>

      <template v-else>
        <div class="orders-list">
          <NuxtLink
            v-for="order in orders"
            :key="order.id"
            :to="`/orders/${order.id}`"
            class="order-card"
          >
            <div class="order-header">
              <span class="order-id">Order #{{ order.id.slice(0, 8) }}</span>
              <span
                class="order-status"
                :style="{ backgroundColor: statusColors[order.status] }"
              >
                {{ statusLabels[order.status] }}
              </span>
            </div>
            <div class="order-details">
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              <span class="order-items">{{ order.itemCount }} item(s)</span>
              <span class="order-total">{{
                formatPrice(order.totalPrice, order.currency)
              }}</span>
            </div>
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.orders-container {
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
}

h1 {
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.auth-required,
.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
}

.error {
  color: var(--color-danger);
}

.login-link,
.shop-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border-radius: var(--border-radius-md);
  text-decoration: none;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  display: block;
  padding: 1.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-id {
  font-weight: 600;
  font-size: 1.1rem;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  color: white;
  font-size: 0.875rem;
}

.order-details {
  display: flex;
  gap: 2rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.order-total {
  margin-left: auto;
  font-weight: 600;
  color: var(--color-text);
}
</style>
