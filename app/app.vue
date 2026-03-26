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
      <NuxtPage />
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
</style>
