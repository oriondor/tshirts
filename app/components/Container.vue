<template>
  <div class="container">
    <slot />
  </div>
</template>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.container > * {
  animation: containerFadeInUp 0.5s ease-out both;
}

@keyframes containerFadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
