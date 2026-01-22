<script setup lang="ts">
const emit = defineEmits<{
  success: [];
  switchToSignup: [];
}>();

const form = reactive({
  email: "",
  password: "",
});
const error = ref("");
const loading = ref(false);

const { checkValidity, errors } = useValidation([
  {
    model: toRef(form, "email"),
    id: "email",
    validator: isFilled,
    message: "Email is required",
  },
  {
    model: toRef(form, "email"),
    id: "email",
    validator: isEmail,
    message: "Email is incorrect",
  },
  {
    model: toRef(form, "password"),
    id: "password",
    validator: isFilled,
    message: "Password is required",
  },
]);

async function handleSubmit() {
  if (!checkValidity()) return;

  error.value = "";
  loading.value = true;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: form,
    });
    emit("success");
  } catch (err: any) {
    error.value = err.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <orio-view-text type="title">Login</orio-view-text>

    <div v-if="error" class="error-message">{{ error }}</div>

    <orio-input
      v-model="form.email"
      type="email"
      label="Email"
      placeholder="your@email.com"
      :error="errors.email"
    />

    <orio-input
      v-model="form.password"
      type="password"
      label="Password"
      placeholder="Your password"
      :error="errors.password"
    />

    <orio-button type="submit" :disabled="loading">
      {{ loading ? "Logging in..." : "Login" }}
    </orio-button>

    <orio-view-separator />

    <AuthorisationOAuthButton provider="google" />

    <p class="switch-text">
      Don't have an account?
      <a href="#" @click.prevent="emit('switchToSignup')">Sign up</a>
    </p>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.error-message {
  color: var(--color-danger);
  padding: 0.5rem;
  border-radius: var(--border-radius-sm);
  background: rgba(var(--color-danger-rgb), 0.1);
  font-size: 0.875rem;
}

.switch-text {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.switch-text a {
  color: var(--color-text);
  text-decoration: underline;
  cursor: pointer;
}
</style>
