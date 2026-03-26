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
    await useApi("/api/profile", {
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
    await useApi("/api/auth/logout", { method: "POST" });
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
        <div class="profile-information">
          <div class="profile-header">
            <div class="avatar">{{ userInitial }}</div>
            <template v-if="!isEditing">
              <orio-view-text type="title" size="large">
                {{ typedUser.name || "User" }}
              </orio-view-text>
              <orio-view-text type="subtitle">
                {{ typedUser.email }}
              </orio-view-text>
            </template>
            <template v-else>
              <div class="edit-form">
                <orio-input
                  layout="inner"
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
                <orio-view-text type="title">Account</orio-view-text>
                <orio-button
                  v-if="!isEditing"
                  variant="subdued"
                  icon="edit"
                  @click="startEditing"
                >
                  Edit
                </orio-button>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <orio-view-text type="subtitle" size="small">
                    Name
                  </orio-view-text>
                  <orio-view-text type="title">
                    {{ typedUser.name || "Not set" }}
                  </orio-view-text>
                </div>
                <div class="info-item">
                  <orio-view-text type="subtitle" size="small">
                    Email
                  </orio-view-text>
                  <orio-view-text type="title">
                    {{ typedUser.email }}
                  </orio-view-text>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="details">
          <NuxtLink to="/orders" class="section section-link">
            <div class="section-header">
              <orio-view-text type="title">Orders</orio-view-text>
              <orio-icon name="chevron-right" />
            </div>
            <div class="orders-summary">
              <orio-view-text v-if="ordersLoading" type="title" size="large">
                Loading...
              </orio-view-text>
              <orio-view-text v-else type="title" size="large">
                {{ orders.length }}
                {{ orders.length === 1 ? "order" : "orders" }}
              </orio-view-text>
              <orio-view-text type="subtitle">
                View order history
              </orio-view-text>
            </div>
          </NuxtLink>

          <div class="section">
            <address-manager mode="profile" />
          </div>

          <orio-button
            variant="secondary"
            :disabled="loggingOut"
            fill
            @click="handleLogout"
          >
            {{ loggingOut ? "Logging out..." : "Log out" }}
          </orio-button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="auth-container">
        <authorisation-login-form
          v-if="authMode === 'login'"
          @success="handleAuthSuccess"
          @switch-to-signup="authMode = 'signup'"
        />
        <authorisation-signup-form
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
  padding-inline: 1rem;
}

.profile-content {
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profile-information {
  height: fit-content;
  flex: 1;
  min-width: 28rem;
}

@media (min-width: 970px) {
  .profile-information {
    position: sticky;
    top: var(--nav-height);
  }
}

.details {
  flex: 1;
  min-width: 29rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.orders-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-container {
  max-width: 28rem;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
}

@media (max-width: 480px) {
  .avatar {
    width: 4rem;
    height: 4rem;
    font-size: 1.5rem;
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
