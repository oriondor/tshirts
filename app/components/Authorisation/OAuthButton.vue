<script setup lang="ts">
import { capitalCase } from "change-case";

interface Props {
  provider: string;
}

const props = defineProps<Props>();

function handleClick() {
  window.location.href = `/api/auth/${props.provider}`;
}
</script>

<template>
  <orio-button class="oauth-btn" variant="secondary" @click="handleClick">
    Continue with {{ capitalCase(provider) }}
  </orio-button>
</template>

<style scoped>
.oauth-btn {
  width: 100%;
}
</style>
