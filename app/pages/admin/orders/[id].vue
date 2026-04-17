<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const { t } = useI18n();
const route = useRoute();
const { fetchOrder, loading, error } = useAdmin();
const order = ref<Awaited<ReturnType<typeof fetchOrder>>>(null);

onMounted(async () => {
  const orderId = route.params.id as string;
  order.value = await fetchOrder(orderId);
});
</script>

<template>
  <div class="admin-order-page">
    <div class="admin-container">
      <NuxtLink to="/admin/orders" class="back-link">{{ t('orders.backToOrders') }}</NuxtLink>

      <div v-if="loading" class="loading">{{ t('orders.loadingOrder') }}</div>

      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="!order" class="not-found">{{ t('orders.orderNotFound') }}</div>

      <div class="order-info" v-else>
        <order-header
          :id="order.id"
          :status="order.status"
          :created-at="order.createdAt"
        >
          <div v-if="order.user" class="user-info">
            <orio-view-text type="subtitle" size="small">
              {{ t('orders.customer') }} {{ order.user.name || order.user.email }}
            </orio-view-text>
            <orio-view-text v-if="order.user.name" type="text" size="small">
              {{ order.user.email }}
            </orio-view-text>
          </div>
        </order-header>

        <admin-order-status-switcher
          :order-id="order.id"
          :current-status="order.status"
          @updated="(status) => (order!.status = status)"
        />

        <order-address v-if="order.address" :address="order.address" />

        <order-items
          v-if="order.items"
          :items="order.items"
          :currency="order.currency"
        />

        <order-notes v-if="order.notes" :notes="order.notes" />

        <order-summary
          :total-price="order.totalPrice"
          :currency="order.currency"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-order-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.admin-container {
  width: 100%;
  max-width: 900px;
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
.not-found {
  text-align: center;
  padding: 2rem;
}

.error {
  color: var(--color-danger);
}

.user-info {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--color-border);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
