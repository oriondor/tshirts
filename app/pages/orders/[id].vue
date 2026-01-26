<script setup lang="ts">
import {
  type Order,
  type OrderItem,
  statusLabels,
  statusColors,
  formatDate,
  formatPrice,
} from "~/composables/useCheckout";

const route = useRoute();
const { loggedIn } = useUserSession();
const { fetchOrder, getImageUrl, loading, error } = useCheckout();
const order = ref<Order | null>(null);

function getItemSubtotal(item: OrderItem): string {
  const subtotal = parseFloat(item.unitPrice) * item.quantity;
  return formatPrice(subtotal.toFixed(2), order.value?.currency || "EUR");
}

onMounted(async () => {
  if (loggedIn.value) {
    const orderId = route.params.id as string;
    order.value = await fetchOrder(orderId);
  }
});

watch(loggedIn, async (isLoggedIn) => {
  if (isLoggedIn && !order.value) {
    const orderId = route.params.id as string;
    order.value = await fetchOrder(orderId);
  }
});
</script>

<template>
  <div class="order-detail-page">
    <div class="order-container">
      <NuxtLink to="/orders" class="back-link">Back to Orders</NuxtLink>

      <template v-if="!loggedIn">
        <div class="auth-required">
          <p>Please log in to view this order.</p>
          <NuxtLink to="/profile" class="login-link">Go to Login</NuxtLink>
        </div>
      </template>

      <template v-else-if="loading">
        <div class="loading">Loading order...</div>
      </template>

      <template v-else-if="error">
        <div class="error">{{ error }}</div>
      </template>

      <template v-else-if="!order">
        <div class="not-found">Order not found.</div>
      </template>

      <template v-else>
        <div class="order-header">
          <div class="order-title">
            <h1>Order #{{ order.id.slice(0, 8) }}</h1>
            <span
              class="order-status"
              :style="{ backgroundColor: statusColors[order.status] }"
            >
              {{ statusLabels[order.status] }}
            </span>
          </div>
          <p class="order-date">Placed on {{ formatDate(order.createdAt) }}</p>
        </div>

        <div class="order-items">
          <h2>Items</h2>
          <div
            v-for="item in order.items"
            :key="item.id"
            class="order-item-card"
          >
            <div class="item-info">
              <div class="item-header">
                <span class="item-type">{{ item.productType }}</span>
                <span class="item-design">Design: {{ item.designId }}</span>
              </div>

              <div class="item-properties">
                <div v-if="item.size" class="property">
                  <span class="property-label">Size:</span>
                  <span class="property-value">{{ item.size }}</span>
                </div>
                <div v-if="item.productColor" class="property">
                  <span class="property-label">Color:</span>
                  <span class="property-value">{{ item.productColor }}</span>
                </div>
                <div v-if="item.designColor" class="property">
                  <span class="property-label">Design Color:</span>
                  <span class="property-value">{{ item.designColor }}</span>
                </div>
                <div v-if="item.name" class="property">
                  <span class="property-label">Name:</span>
                  <span class="property-value">{{ item.name }}</span>
                </div>
                <div v-if="item.secondaryText" class="property">
                  <span class="property-label">Secondary Text:</span>
                  <span class="property-value">{{ item.secondaryText }}</span>
                </div>
              </div>

              <div v-if="item.specialRequest" class="special-request">
                <span class="property-label">Special Request:</span>
                <p>{{ item.specialRequest }}</p>
              </div>

              <div class="item-pricing">
                <span>{{ item.quantity }} x {{ formatPrice(item.unitPrice, order.currency) }}</span>
                <span class="item-subtotal">{{ getItemSubtotal(item) }}</span>
              </div>
            </div>

            <div v-if="item.images && item.images.length > 0" class="item-images">
              <h4>Uploaded Images</h4>
              <div class="images-grid">
                <a
                  v-for="image in item.images"
                  :key="image.id"
                  :href="getImageUrl(image.storagePath)"
                  target="_blank"
                  class="image-thumbnail"
                >
                  <img :src="getImageUrl(image.storagePath)" :alt="image.originalFilename" />
                  <span class="image-name">{{ image.originalFilename }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-if="order.notes" class="order-notes">
          <h2>Notes</h2>
          <p>{{ order.notes }}</p>
        </div>

        <div class="order-summary">
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ formatPrice(order.totalPrice, order.currency) }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.order-detail-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.order-container {
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

.auth-required,
.loading,
.error,
.not-found {
  text-align: center;
  padding: 2rem;
}

.error {
  color: var(--color-danger);
}

.login-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border-radius: var(--border-radius-md);
  text-decoration: none;
}

.order-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.order-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.order-title h1 {
  font-size: 1.5rem;
  margin: 0;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  color: white;
  font-size: 0.875rem;
}

.order-date {
  color: var(--color-muted);
  margin: 0;
}

.order-items h2,
.order-notes h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.order-item-card {
  padding: 1.5rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
  margin-bottom: 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-type {
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: capitalize;
}

.item-design {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.item-properties {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.property {
  display: flex;
  flex-direction: column;
}

.property-label {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.property-value {
  font-weight: 500;
}

.special-request {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
}

.special-request p {
  margin: 0.5rem 0 0 0;
}

.item-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
}

.item-subtotal {
  font-weight: 600;
  color: var(--color-text);
}

.item-images {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.item-images h4 {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.image-thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.image-thumbnail img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.image-name {
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-top: 0.25rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-notes {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
}

.order-notes p {
  margin: 0;
}

.order-summary {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid var(--color-border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
