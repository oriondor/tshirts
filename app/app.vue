<script setup lang="ts">
const { setMode, setTheme } = useTheme();
setMode("light");
setTheme("inverse");
</script>

<template>
  <NuxtLayout>
    <Navigation />
    <NuxtPage class="content" />
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

.content {
  margin: auto;
  width: 60rem;
  max-width: 100%;
  height: calc(100vh + var(--nav-height));
  padding-block: 2rem;
}
</style>
