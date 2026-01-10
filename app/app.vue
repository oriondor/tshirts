<script setup lang="ts">
const { setMode, setTheme } = useTheme();
setMode("light");
setTheme("inverse");
</script>

<template>
  <NuxtLayout>
    <Navigation />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
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
</style>
