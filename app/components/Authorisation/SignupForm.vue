<script setup lang="ts">
const emit = defineEmits<{
  success: [];
  switchToLogin: [];
}>();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const error = ref("");
const loading = ref(false);
const signupComplete = ref(false);

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
    validator: (model) => (isRef(model) ? model.value : model).length >= 8,
    message: "Password must be at least 8 characters",
  },
  {
    model: toRef(form, "confirmPassword"),
    id: "confirmPassword",
    validator: () => form.password === form.confirmPassword,
    message: "Passwords don't match",
  },
]);

async function handleSubmit() {
  if (!checkValidity()) return;

  error.value = "";
  loading.value = true;

  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
        name: form.name,
      },
    });
    signupComplete.value = true;
  } catch (err: any) {
    error.value = err.data?.message || "Signup failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div v-if="signupComplete" class="verification-sent">
    <orio-view-text type="title">Check your email</orio-view-text>
    <p>We've sent a verification link to <strong>{{ form.email }}</strong></p>
    <p class="switch-text">
      Didn't receive it?
      <a href="#" @click.prevent="emit('switchToLogin')">Try logging in</a>
      or check your spam folder.
    </p>
  </div>

  <form v-else class="signup-form" @submit.prevent="handleSubmit">
    <orio-view-text type="title">Sign Up</orio-view-text>

    <div v-if="error" class="error-message">{{ error }}</div>

    <orio-input v-model="form.name" label="Name" placeholder="Your name" />

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
      placeholder="Min. 8 characters"
      :error="errors.password"
    />

    <orio-input
      v-model="form.confirmPassword"
      type="password"
      label="Confirm Password"
      placeholder="Repeat password"
      :error="errors.confirmPassword"
    />

    <orio-button type="submit" :disabled="loading">
      {{ loading ? "Creating account..." : "Create Account" }}
    </orio-button>

    <orio-view-separator />

    <AuthorisationOAuthButton provider="google" />

    <p class="switch-text">
      Already have an account?
      <a href="#" @click.prevent="emit('switchToLogin')">Login</a>
    </p>
  </form>
</template>

<style scoped>
.signup-form,
.verification-sent {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.verification-sent {
  text-align: center;
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
