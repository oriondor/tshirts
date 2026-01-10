<script setup lang="ts"></script>

<template>
  <div class="card"><slot /></div>
</template>

<style scoped>
.card {
  padding: 1rem;
  width: 25rem;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-bg-1);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
}

.card:hover {
  background-color: var(--color-bg-2);
}

:deep(img) {
  max-width: 100%;
  border-radius: var(--border-radius-lg);
}
</style>
