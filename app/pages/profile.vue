<script setup lang="ts">
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
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.auth-container {
  min-width: 35rem;
  max-width: 100%;
  padding: 2rem;
  background: var(--color-bg-1);
  border-radius: var(--border-radius-lg);
}
</style>
