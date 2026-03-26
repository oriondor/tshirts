<script setup lang="ts">
const { setMode, setTheme } = useTheme();
setMode("light");
setTheme("inverse");

onMounted(() => {
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false },
  );
});
</script>

<template>
  <NuxtLayout>
    <Navigation />
    <div class="content">
      <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
    </div>
  </NuxtLayout>
</template>

<style>
html {
  overflow-x: clip;
  container-type: scroll-state;
}

html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  height: 100%;
  background: var(--color-bg);
  color: var(--color-text);
}

/* Disable double-tap zoom globally via touch-action */
* {
  touch-action: manipulation;
}

/* Smooth transitions for interactive elements */
a,
button {
  transition:
    color 0.3s ease,
    opacity 0.3s ease;
}

.content {
  margin: auto;
  width: 70rem;
  max-width: 100%;
  min-height: calc(100vh);
  padding-block: 2rem;
}

/* Page transitions */
.page-enter-active {
  transition:
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(0.75rem);
}

.page-leave-to {
  opacity: 0;
}
</style>
