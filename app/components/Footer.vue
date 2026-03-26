<template>
  <footer class="footer">
    <div class="footer-inner">
      <slot />
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  height: var(--foot-height);
  background-color: var(--color-bg-1);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.footer-inner {
  margin: auto;
  max-width: 60rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
</style>
