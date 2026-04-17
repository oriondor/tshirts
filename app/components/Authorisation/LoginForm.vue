<script setup lang="ts">
const emit = defineEmits<{
  success: [];
  switchToSignup: [];
}>();

const form = reactive({
  email: "",
  password: "",
});
const { t } = useI18n();
const error = ref("");
const loading = ref(false);
const needsVerification = ref(false);
const resendLoading = ref(false);
const resendSuccess = ref(false);

const { checkValidity, errors } = useValidation([
  {
    model: toRef(form, "email"),
    id: "email",
    validator: isFilled,
    message: t('auth.emailRequired'),
  },
  {
    model: toRef(form, "email"),
    id: "email",
    validator: isEmail,
    message: t('auth.emailIncorrect'),
  },
  {
    model: toRef(form, "password"),
    id: "password",
    validator: isFilled,
    message: t('auth.passwordRequired'),
  },
]);

async function handleSubmit() {
  if (!checkValidity()) return;

  error.value = "";
  needsVerification.value = false;
  loading.value = true;

  try {
    await useApi("/api/auth/login", {
      method: "POST",
      body: form,
    });
    emit("success");
  } catch (err: any) {
    if (err.statusCode === 403) {
      needsVerification.value = true;
    }
    error.value = err.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}

async function handleResendVerification() {
  resendLoading.value = true;
  resendSuccess.value = false;

  try {
    await useApi("/api/auth/resend-verification", {
      method: "POST",
      body: { email: form.email },
    });
    resendSuccess.value = true;
  } finally {
    resendLoading.value = false;
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <orio-view-text type="title">{{ t('auth.login') }}</orio-view-text>

    <div v-if="error" class="error-message">
      {{ error }}
      <template v-if="needsVerification">
        <br />
        <a
          v-if="!resendSuccess"
          href="#"
          @click.prevent="handleResendVerification"
        >
          {{ resendLoading ? t('auth.sendingVerification') : t('auth.resendVerification') }}
        </a>
        <span v-else>{{ t('auth.verificationSent') }}</span>
      </template>
    </div>

    <orio-input
      layout="inner"
      v-model="form.email"
      type="email"
      :label="t('auth.emailLabel')"
      :placeholder="t('auth.emailPlaceholder')"
      :error="errors.email"
    />

    <orio-input
      layout="inner"
      v-model="form.password"
      type="password"
      :label="t('auth.passwordLabel')"
      :placeholder="t('auth.passwordPlaceholder')"
      :error="errors.password"
    />

    <orio-button type="submit" :disabled="loading" fill>
      {{ loading ? t('auth.loggingIn') : t('auth.login') }}
    </orio-button>

    <orio-view-separator />

    <AuthorisationOAuthButton provider="google" />

    <orio-view-text type="subtitle" class="switch-text">
      {{ t('auth.noAccount') }}
      <a href="#" @click.prevent="emit('switchToSignup')">{{ t('auth.signupLink') }}</a>
    </orio-view-text>
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
  justify-content: center;
}

.switch-text a {
  color: var(--color-text);
  text-decoration: underline;
  cursor: pointer;
}
</style>
