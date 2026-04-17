<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const { t } = useI18n();
</script>

<template>
  <div class="admin-users-page">
    <div class="admin-container">
      <NuxtLink to="/admin" class="back-link">{{ t('admin.backToAdmin') }}</NuxtLink>

      <orio-view-text type="title" size="large">{{ t('admin.users') }}</orio-view-text>

      <orio-empty-state class="empty-state">
        <template #title>{{ t('admin.comingSoon') }}</template>
        <template #description>{{ t('admin.userManagement') }}</template>
      </orio-empty-state>
    </div>
  </div>
</template>

<style scoped>
.admin-users-page {
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

.empty-state {
  margin-top: 2rem;
}
</style>
