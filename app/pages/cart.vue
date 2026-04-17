<script setup lang="ts">
const { t } = useI18n();
const { items, removeItem, isLoaded, load, total, clear } = useCart();
const { createOrder, error: orderError, loading: orderLoading } = useCheckout();
const { loggedIn } = useUserSession();

const selectedAddressId = ref<string | null>(null);

const canCheckout = computed(
  () =>
    loggedIn.value &&
    items.value.length > 0 &&
    selectedAddressId.value !== null,
);

async function processOrder() {
  if (!canCheckout.value) return;
  const order = await createOrder(
    items.value,
    undefined,
    selectedAddressId.value!,
  );
  if (!order) return;
  clear();
  navigateTo(`/orders/${order.id}`);
}

onMounted(() => {
  load();
});
</script>

<template>
  <div>
    <orio-animated-container v-if="isLoaded" direction="column">
      <cart-item
        v-for="(item, index) in items"
        :key="item.id"
        v-model="items[index]"
        @remove="removeItem(index)"
      />
      <div v-if="!items.length" class="empty">{{ t('cart.empty') }}</div>

      <div v-if="loggedIn && items.length" class="shipping-section">
        <orio-view-separator />
        <address-manager
          v-model:selected-id="selectedAddressId"
          mode="order"
          :title="t('cart.shippingAddress')"
        />
      </div>
    </orio-animated-container>
    <div v-else>{{ t('common.loading') }}</div>
    <Footer>
      <div class="subtotal">
        <orio-view-text
          v-if="orderError"
          type="text"
          size="small"
          class="order-error"
        >
          {{ orderError }}
        </orio-view-text>
        <orio-view-text
          v-else-if="loggedIn && items.length && !selectedAddressId"
          type="subtitle"
          size="small"
          class="address-hint"
        >
          {{ t('cart.selectAddress') }}
        </orio-view-text>
        <orio-view-text type="title">{{ t('cart.subtotal') }}</orio-view-text>
        <cart-item-amount-view :total />
        <orio-button
          v-if="loggedIn"
          icon="shopping-bag"
          :disabled="!canCheckout || orderLoading"
          @click="processOrder"
        >
          {{ orderLoading ? t('cart.processing') : t('cart.checkout') }}
        </orio-button>
        <orio-button
          v-else
          @click="navigateTo('/profile')"
          variant="secondary"
          icon="user"
        >
          {{ t('cart.loginToCheckout') }}
        </orio-button>
      </div>
    </Footer>
  </div>
</template>

<style scoped>
.subtotal {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.address-hint {
  margin-right: auto;
}

.order-error {
  margin-right: auto;
  color: var(--color-danger) !important;
}

.shipping-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .footer {
    --foot-height: 4rem;
  }
}
</style>
