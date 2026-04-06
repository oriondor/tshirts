<script setup lang="ts">
const expanded = defineModel();
const { t } = useI18n();
</script>

<template>
  <orio-button variant="subdued" @click="expanded = !expanded" fill>
    <template #icon>
      <orio-icon
        name="chevron-down"
        :size="24"
        :class="{ rotated: expanded }"
      />
    </template>
    {{ t('showMore') }}
  </orio-button>
</template>

<style scoped></style>
