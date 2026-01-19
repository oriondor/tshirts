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
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
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
