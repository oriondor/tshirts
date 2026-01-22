<script setup lang="ts">
interface User {
  id: string;
  email: string;
  name: string | null;
}

defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  logout: [];
}>();

const loading = ref(false);

async function handleLogout() {
  loading.value = true;
  try {
    await $fetch("/api/auth/logout", { method: "POST" });
    emit("logout");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="profile">
    <div class="profile-header">
      <div class="avatar">
        {{ user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase() }}
      </div>
      <div class="profile-info">
        <orio-view-text type="title" size="small">
          {{ user.name || "User" }}
        </orio-view-text>
        <orio-view-text type="subtitle">{{ user.email }}</orio-view-text>
      </div>
    </div>

    <orio-view-separator />

    <orio-button variant="secondary" :disabled="loading" @click="handleLogout">
      {{ loading ? "Logging out..." : "Logout" }}
    </orio-button>
  </div>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-bg-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
