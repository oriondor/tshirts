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
const { t } = useI18n();
const error = ref("");
const loading = ref(false);
const signupComplete = ref(false);

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
    validator: (model) => (isRef(model) ? model.value : model).length >= 8,
    message: t('auth.passwordMinLength'),
  },
  {
    model: toRef(form, "confirmPassword"),
    id: "confirmPassword",
    validator: () => form.password === form.confirmPassword,
    message: t('auth.passwordsNoMatch'),
  },
]);

async function handleSubmit() {
  if (!checkValidity()) return;

  error.value = "";
  loading.value = true;

  try {
    await useApi("/api/auth/signup", {
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
    <orio-view-text type="title">{{ t('auth.checkEmail') }}</orio-view-text>
    <orio-view-text type="text">
      {{ t('auth.verificationLinkSent') }} <strong>{{ form.email }}</strong>
    </orio-view-text>
    <orio-view-text type="subtitle" class="switch-text">
      {{ t('auth.didntReceive') }}
      <a href="#" @click.prevent="emit('switchToLogin')">{{ t('auth.tryLoggingIn') }}</a>
      {{ t('auth.orCheckSpam') }}
    </orio-view-text>
  </div>

  <form v-else class="signup-form" @submit.prevent="handleSubmit">
    <orio-view-text type="title">{{ t('auth.signup') }}</orio-view-text>

    <div v-if="error" class="error-message">{{ error }}</div>

    <orio-input layout="inner" v-model="form.name" :label="t('auth.nameLabel')" :placeholder="t('auth.namePlaceholder')" />

    <orio-input layout="inner"
      v-model="form.email"
      type="email"
      :label="t('auth.emailLabel')"
      :placeholder="t('auth.emailPlaceholder')"
      :error="errors.email"
    />

    <orio-input layout="inner"
      v-model="form.password"
      type="password"
      :label="t('auth.passwordLabel')"
      :placeholder="t('auth.minChars')"
      :error="errors.password"
    />

    <orio-input layout="inner"
      v-model="form.confirmPassword"
      type="password"
      :label="t('auth.confirmPassword')"
      :placeholder="t('auth.repeatPassword')"
      :error="errors.confirmPassword"
    />

    <orio-button type="submit" :disabled="loading">
      {{ loading ? t('auth.creatingAccount') : t('auth.createAccount') }}
    </orio-button>

    <orio-view-separator />

    <AuthorisationOAuthButton provider="google" />

    <orio-view-text type="subtitle" class="switch-text">
      {{ t('auth.hasAccount') }}
      <a href="#" @click.prevent="emit('switchToLogin')">{{ t('auth.loginLink') }}</a>
    </orio-view-text>
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
  justify-content: center;
}

.switch-text a {
  color: var(--color-text);
  text-decoration: underline;
  cursor: pointer;
}
</style>
