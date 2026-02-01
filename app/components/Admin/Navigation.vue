<script setup lang="ts">
interface Props {
  paidOrdersCount?: number;
}

defineProps<Props>();
</script>

<template>
  <div class="admin-navigation">
    <orio-badge>
      <template #wrapping>
        <orio-nav-button @click="navigateTo('/admin/orders')">
          Orders
        </orio-nav-button>
      </template>
      {{ paidOrdersCount }}
    </orio-badge>
    <orio-nav-button @click="navigateTo('/admin/users')">Users</orio-nav-button>
  </div>
</template>

<style scoped>
.admin-navigation {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
