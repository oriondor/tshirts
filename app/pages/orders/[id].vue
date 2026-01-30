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
const { formatAddressLines } = useAddresses();
const order = ref<Order | null>(null);
const paymentLoading = ref(false);
const paymentError = ref<string | null>(null);

function getItemSubtotal(item: OrderItem): string {
  const subtotal = parseFloat(item.unitPrice) * item.quantity;
  return formatPrice(subtotal.toFixed(2), order.value?.currency || "EUR");
}

async function handlePayNow() {
  if (!order.value) return;

  paymentLoading.value = true;
  paymentError.value = null;

  try {
    const response = await $fetch<{
      success: boolean;
      checkoutUrl: string;
      cartId: string;
    }>("/api/shopify/create-checkout", {
      method: "POST",
      body: { orderId: order.value.id },
    });

    if (response.success && response.checkoutUrl) {
      // Redirect to Shopify checkout
      window.location.href = response.checkoutUrl;
    }
  } catch (e: any) {
    paymentError.value =
      e?.data?.message || e?.message || "Failed to create checkout";
  } finally {
    paymentLoading.value = false;
  }
}

const propertyLabels: Record<string, string> = {
  size: "Size",
  productColor: "Color",
  designColor: "Design Color",
  name: "Name",
  secondaryText: "Secondary Text",
};

function getItemProperties(item: OrderItem) {
  return Object.entries(propertyLabels)
    .filter(([key]) => item[key as keyof OrderItem])
    .map(([key, label]) => ({
      label,
      value: item[key as keyof OrderItem] as string,
    }));
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
            <orio-view-text type="title" size="large">
              Order #{{ order.id.slice(0, 8) }}
            </orio-view-text>
            <span
              class="order-status"
              :style="{ backgroundColor: statusColors[order.status] }"
            >
              {{ statusLabels[order.status] }}
            </span>
          </div>
          <orio-view-text type="subtitle">
            Placed on {{ formatDate(order.createdAt) }}
          </orio-view-text>
        </div>

        <div v-if="order.address" class="order-address">
          <orio-view-text type="title" class="section-title">
            Shipping Address
          </orio-view-text>
          <div class="address-content">
            <orio-view-text
              v-for="(line, index) in formatAddressLines(order.address)"
              :key="index"
              :type="index === 0 ? 'title' : 'text'"
              size="small"
            >
              {{ line }}
            </orio-view-text>
          </div>
        </div>

        <div class="order-items">
          <orio-view-text type="title" class="section-title">
            Items
          </orio-view-text>
          <div
            v-for="item in order.items"
            :key="item.id"
            class="order-item-card"
          >
            <div class="item-info">
              <div class="item-header">
                <orio-view-text type="title">
                  {{ item.productType }}
                </orio-view-text>
                <orio-view-text type="subtitle" size="small">
                  Design: {{ item.designId }}
                </orio-view-text>
              </div>

              <div class="item-properties">
                <properties-property-display
                  v-for="prop in getItemProperties(item)"
                  :key="prop.label"
                  :label="prop.label"
                  :value="prop.value"
                />
              </div>

              <div v-if="item.specialRequest" class="special-request">
                <orio-view-text type="subtitle" size="small">
                  Special Request
                </orio-view-text>
                <orio-view-text type="text">{{
                  item.specialRequest
                }}</orio-view-text>
              </div>

              <div class="item-pricing">
                <orio-view-text type="subtitle">
                  {{ item.quantity }} x
                  {{ formatPrice(item.unitPrice, order.currency) }}
                </orio-view-text>
                <orio-view-text type="title">{{
                  getItemSubtotal(item)
                }}</orio-view-text>
              </div>
            </div>

            <div
              v-if="item.images && item.images.length > 0"
              class="item-images"
            >
              <orio-view-text type="subtitle" size="small">
                Uploaded Images
              </orio-view-text>
              <div class="images-grid">
                <a
                  v-for="image in item.images"
                  :key="image.id"
                  :href="getImageUrl(image.storagePath)"
                  target="_blank"
                  class="image-thumbnail"
                >
                  <img
                    :src="getImageUrl(image.storagePath)"
                    :alt="image.originalFilename"
                  />
                  <orio-view-text type="subtitle" size="small" :line-clamp="1">
                    {{ image.originalFilename }}
                  </orio-view-text>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-if="order.notes" class="order-notes">
          <orio-view-text type="title" class="section-title"
            >Notes</orio-view-text
          >
          <orio-view-text type="text">{{ order.notes }}</orio-view-text>
        </div>

        <div class="order-summary">
          <div class="summary-row">
            <orio-view-text type="title" size="large">Total</orio-view-text>
            <orio-view-text type="title" size="large">
              {{ formatPrice(order.totalPrice, order.currency) }}
            </orio-view-text>
          </div>
        </div>

        <div v-if="order.status === 'unpaid'" class="payment-section">
          <div v-if="paymentError" class="payment-error">
            {{ paymentError }}
          </div>
          <button
            class="pay-now-button"
            :disabled="paymentLoading"
            @click="handlePayNow"
          >
            {{ paymentLoading ? "Creating checkout..." : "Pay Now" }}
          </button>
          <orio-view-text type="subtitle" size="small" class="payment-note">
            You will be redirected to Shopify to complete your payment
          </orio-view-text>
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

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  color: white;
  font-size: 0.875rem;
}

.section-title {
  margin-bottom: 1rem;
}

.order-address {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
}

.address-content {
  display: flex;
  flex-direction: column;
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

.item-properties {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.special-request {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
}

.item-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.item-images {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

.order-notes {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
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

.payment-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.payment-error {
  color: var(--color-danger);
  padding: 0.75rem 1rem;
  background: var(--color-danger-soft, rgba(220, 38, 38, 0.1));
  border-radius: var(--border-radius-md);
  width: 100%;
  text-align: center;
}

.pay-now-button {
  width: 100%;
  max-width: 300px;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: var(--color-accent);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.pay-now-button:hover:not(:disabled) {
  background: var(--color-accent-hover, var(--color-accent));
  opacity: 0.9;
}

.pay-now-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.payment-note {
  color: var(--color-text-muted, #666);
  text-align: center;
}
</style>
