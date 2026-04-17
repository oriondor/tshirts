<script setup lang="ts">
import { capitalCase } from "change-case";

interface Props {
  provider: string;
}

const props = defineProps<Props>();
const { t } = useI18n();

function handleClick() {
  window.location.href = `/api/auth/${props.provider}`;
}
</script>

<template>
  <orio-button class="oauth-btn" variant="secondary" fill @click="handleClick">
    {{ t('auth.continueWith', { provider: capitalCase(provider) }) }}
  </orio-button>
</template>

<style scoped>
.oauth-btn {
  width: 100%;
}
</style>
