<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  variant?: "grid" | "carousel";
}

const { variant = "grid" } = defineProps<Props>();
</script>

<template>
  <div v-reveal class="upsell-section">
    <div class="upsell-header">
      <orio-view-text type="title" size="large">{{ title }}</orio-view-text>
      <orio-view-text v-if="subtitle" type="subtitle">
        {{ subtitle }}
      </orio-view-text>
    </div>
    <orio-animated-container
      v-if="variant === 'grid'"
      v-slot="{ play }"
      class="upsell-grid"
    >
      <slot :play />
    </orio-animated-container>
    <div v-else class="upsell-carousel">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.upsell-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1rem;
}

.upsell-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.upsell-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.upsell-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 0.5rem;
}

.upsell-carousel::-webkit-scrollbar {
  display: none;
}
</style>
