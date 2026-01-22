<script setup lang="ts">
interface User {
  id: string;
  email: string;
  name: string | null;
}

const { loggedIn, user, fetch: fetchSession, clear } = useUserSession();

const authMode = ref<"login" | "signup">("login");

async function handleAuthSuccess() {
  await fetchSession();
}

async function handleLogout() {
  clear();
}
</script>

<template>
  <div class="profile-page">
    <div class="auth-container">
      <template v-if="loggedIn && user">
        <AuthorisationProfile :user="user as User" @logout="handleLogout" />
      </template>
      <template v-else>
        <AuthorisationLoginForm
          v-if="authMode === 'login'"
          @success="handleAuthSuccess"
          @switch-to-signup="authMode = 'signup'"
        />
        <AuthorisationSignupForm
          v-else
          @success="handleAuthSuccess"
          @switch-to-login="authMode = 'login'"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 24rem;
  padding: 2rem;
  background: var(--color-bg-1);
  border-radius: var(--border-radius-lg);
}
</style>
