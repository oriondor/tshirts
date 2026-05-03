<script setup lang="ts">
import { headlines } from "@/assets/configs/headlines";

const activeHeadlines = computed(() => headlines.filter((h) => h.active));
const containerReference = useTemplateRef<HTMLElement>("container");

const NAV_HEIGHT_PX = 64;

function scrollPastHeadlines() {
  const nextElement = containerReference.value?.nextElementSibling;
  if (!(nextElement instanceof HTMLElement)) return;
  const top =
    nextElement.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_PX;
  window.scrollTo({ top, behavior: "smooth" });
}
</script>

<template>
  <div ref="container" class="headlines">
    <component
      :is="headline.target ? 'NuxtLink' : 'div'"
      v-for="headline in activeHeadlines"
      :key="headline.id"
      :to="headline.target"
      class="headline"
      @click="!headline.target && scrollPastHeadlines()"
    >
      <img :src="`/headlines/${headline.id}.png`" :alt="headline.id" />
    </component>
  </div>
</template>

<style scoped>
.headlines {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;
}

.headline {
  display: block;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.headline:hover {
  transform: scale(1.01);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.12);
}

.headline img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

@media (max-width: 768px) {
  .headlines {
    margin-bottom: 1rem;
  }

  .headline {
    border-radius: 0.5rem;
  }
}
</style>
