<script setup lang="ts">
import type { Address } from "~/types/address";

interface Props {
  address: Address;
}

defineProps<Props>();

const { t } = useI18n();
const { formatAddressLines } = useAddresses();
</script>

<template>
  <div class="order-address">
    <orio-view-text type="title" class="section-title">
      {{ t('orders.sectionShippingAddress') }}
    </orio-view-text>
    <div class="address-content">
      <orio-view-text
        v-for="(line, index) in formatAddressLines(address)"
        :key="index"
        :type="index === 0 ? 'title' : 'text'"
        size="small"
      >
        {{ line }}
      </orio-view-text>
    </div>
  </div>
</template>

<style scoped>
.order-address {
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--border-radius-md);
}

.section-title {
  margin-bottom: 1rem;
}

.address-content {
  display: flex;
  flex-direction: column;
}
</style>
