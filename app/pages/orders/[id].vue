<script setup lang="ts">
import type { Order } from "~/composables/useCheckout";

const route = useRoute();
const { loggedIn } = useUserSession();
const { fetchOrder, loading, error } = useCheckout();
const order = ref<Order | null>(null);
const paymentLoading = ref(false);
const paymentError = ref<string | null>(null);

async function handlePayNow() {
  if (!order.value) return;

  paymentLoading.value = true;
  paymentError.value = null;

  try {
    const response = await useApi<{
      success: boolean;
      checkoutUrl: string;
      cartId: string;
    }>("/api/shopify/create-checkout", {
      method: "POST",
      body: { orderId: order.value.id },
    });

    if (response.success && response.checkoutUrl) {
      window.location.href = response.checkoutUrl;
    }
  } catch (e: any) {
    paymentError.value =
      e?.data?.message || e?.message || "Failed to create checkout";
  } finally {
    paymentLoading.value = false;
  }
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

      <div class="order-info" v-else>
        <order-header
          :id="order.id"
          :status="order.status"
          :created-at="order.createdAt"
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
        >
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
        </order-summary>
      </div>
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

.payment-section {
  margin-top: 1.5rem;
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

.order-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
