<script setup lang="ts">
import type { User } from "~/types/user";
import type { Order } from "~/composables/useCheckout";

const { loggedIn, user, fetch: fetchSession, clear } = useUserSession();
const { fetchOrders } = useCheckout();

const authMode = ref<"login" | "signup">("login");
const isEditing = ref(false);
const editName = ref("");
const saving = ref(false);
const loggingOut = ref(false);
const orders = ref<Order[]>([]);
const ordersLoading = ref(false);

const typedUser = computed(() => user.value as User | null);

const userInitial = computed(() => {
  if (!typedUser.value) return "";
  return (
    typedUser.value.name?.charAt(0)?.toUpperCase() ||
    typedUser.value.email.charAt(0).toUpperCase()
  );
});

async function loadOrders() {
  if (!loggedIn.value) return;
  ordersLoading.value = true;
  try {
    orders.value = await fetchOrders();
  } finally {
    ordersLoading.value = false;
  }
}

onMounted(() => {
  if (loggedIn.value) {
    loadOrders();
  }
});

watch(loggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    loadOrders();
  } else {
    orders.value = [];
  }
});

async function handleAuthSuccess() {
  await fetchSession();
}

function startEditing() {
  editName.value = typedUser.value?.name || "";
  isEditing.value = true;
}

function cancelEditing() {
  isEditing.value = false;
  editName.value = "";
}

async function saveProfile() {
  saving.value = true;
  try {
    await $fetch("/api/profile", {
      method: "PATCH",
      body: { name: editName.value },
    });
    await fetchSession();
    isEditing.value = false;
  } finally {
    saving.value = false;
  }
}

async function handleLogout() {
  loggingOut.value = true;
  try {
    await $fetch("/api/auth/logout", { method: "POST" });
    clear();
  } finally {
    loggingOut.value = false;
  }
}
</script>

<template>
  <div class="profile-page">
    <template v-if="loggedIn && typedUser">
      <div class="profile-content">
        <div class="profile-header">
          <div class="avatar">{{ userInitial }}</div>
          <template v-if="!isEditing">
            <h1 class="user-name">{{ typedUser.name || "User" }}</h1>
            <p class="user-email">{{ typedUser.email }}</p>
          </template>
          <template v-else>
            <div class="edit-form">
              <orio-input
                v-model="editName"
                placeholder="Your name"
                class="name-input"
              />
              <div class="edit-actions">
                <orio-button
                  variant="secondary"
                  :disabled="saving"
                  @click="cancelEditing"
                >
                  Cancel
                </orio-button>
                <orio-button :disabled="saving" @click="saveProfile">
                  {{ saving ? "Saving..." : "Save" }}
                </orio-button>
              </div>
            </div>
          </template>
        </div>

        <div class="profile-sections">
          <div class="section">
            <div class="section-header">
              <h2>Account</h2>
              <orio-button
                v-if="!isEditing"
                variant="subdued"
                @click="startEditing"
              >
                Edit
              </orio-button>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">{{
                  typedUser.name || "Not set"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ typedUser.email }}</span>
              </div>
            </div>
          </div>

          <NuxtLink to="/orders" class="section section-link">
            <div class="section-header">
              <h2>Orders</h2>
              <span class="arrow">&#8250;</span>
            </div>
            <div class="orders-summary">
              <span v-if="ordersLoading" class="orders-count">Loading...</span>
              <span v-else class="orders-count">
                {{ orders.length }}
                {{ orders.length === 1 ? "order" : "orders" }}
              </span>
              <span class="orders-hint">View order history</span>
            </div>
          </NuxtLink>
        </div>

        <div class="profile-footer">
          <orio-button
            variant="secondary"
            :disabled="loggingOut"
            @click="handleLogout"
          >
            {{ loggingOut ? "Logging out..." : "Log out" }}
          </orio-button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="auth-container">
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
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100%;
  padding: 1.5rem;
}

.profile-content {
  max-width: 32rem;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
}

.avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.user-email {
  color: var(--color-muted);
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 16rem;
}

.name-input {
  text-align: center;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: 1.25rem;
}

.section-link {
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}

.section-link:hover {
  background: var(--color-bg-1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.arrow {
  font-size: 1.25rem;
  color: var(--color-muted);
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.info-value {
  font-weight: 500;
}

.orders-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-count {
  font-size: 1.25rem;
  font-weight: 600;
}

.orders-hint {
  color: var(--color-muted);
  font-size: 0.875rem;
}

.profile-footer {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
}

.auth-container {
  max-width: 28rem;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
}

@media (max-width: 480px) {
  .profile-page {
    padding: 1rem;
  }

  .avatar {
    width: 4rem;
    height: 4rem;
    font-size: 1.5rem;
  }

  .user-name {
    font-size: 1.25rem;
  }

  .section {
    padding: 1rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .orders-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
