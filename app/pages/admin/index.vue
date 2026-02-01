<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const { fetchOrders, loading } = useAdmin();
const paidCount = ref(0);

onMounted(async () => {
  const { paidCount: count } = await fetchOrders();
  paidCount.value = count;
});
</script>

<template>
  <div class="admin-page">
    <div class="admin-container">
      <orio-view-text type="title" size="large">Admin Panel</orio-view-text>
      <orio-view-text type="subtitle">
        Welcome to the admin dashboard
      </orio-view-text>

      <admin-navigation v-if="!loading" :paid-orders-count="paidCount" />
      <div v-else class="loading">Loading...</div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
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

.loading {
  margin-top: 1.5rem;
}
</style>
