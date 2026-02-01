<script setup lang="ts">
import {
  statusLabels,
  statusColors,
  formatDate,
  formatPrice,
} from "~/composables/useCheckout";

definePageMeta({
  middleware: "admin",
});

const { fetchOrders, loading, error } = useAdmin();

const orders = ref<
  Array<{
    id: string;
    userId: string;
    status: string;
    totalPrice: string;
    currency: string;
    createdAt: string;
    itemCount: number;
  }>
>([]);

onMounted(async () => {
  const response = await fetchOrders();
  orders.value = response.orders;
});
</script>

<template>
  <div class="admin-orders-page">
    <div class="admin-container">
      <NuxtLink to="/admin" class="back-link">Back to Admin</NuxtLink>

      <orio-view-text type="title" size="large">All Orders</orio-view-text>

      <div v-if="loading" class="loading">Loading orders...</div>

      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="orders.length === 0" class="empty">No orders found.</div>

      <div v-else class="orders-list">
        <NuxtLink
          v-for="order in orders"
          :key="order.id"
          :to="`/admin/orders/${order.id}`"
          class="order-row"
          :class="{ 'order-paid': order.status === 'paid' }"
        >
          <div class="order-info">
            <orio-view-text type="title">
              #{{ order.id.slice(0, 8) }}
            </orio-view-text>
            <orio-view-text type="subtitle" size="small">
              {{ formatDate(order.createdAt) }}
            </orio-view-text>
          </div>

          <div class="order-details">
            <orio-view-text type="text">
              {{ order.itemCount }} item{{ order.itemCount !== 1 ? "s" : "" }}
            </orio-view-text>
            <orio-view-text type="title">
              {{ formatPrice(order.totalPrice, order.currency) }}
            </orio-view-text>
          </div>

          <span
            class="order-status"
            :style="{ backgroundColor: statusColors[order.status] }"
          >
            {{ statusLabels[order.status] }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-orders-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.admin-container {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
}

.error {
  color: var(--color-danger);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}

.order-row:hover {
  background: var(--color-border);
}

.order-row.order-paid {
  border-left: 4px solid var(--color-info);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  color: white;
  font-size: 0.875rem;
}
</style>
