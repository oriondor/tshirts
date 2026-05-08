<script setup lang="ts">
import { isPrerenderedDesign, type Design } from "~/assets/configs/designs";
import type { ProductId } from "~/types/products";

const { design } = defineProps<{ design: Design }>();
const emit = defineEmits<{ dismiss: [] }>();

const { t } = useI18n();

const { getPrerenderedImagePath } = useDesign(
  design.productId as ProductId,
  design.id,
);

const thumbnail = computed(() => {
  if (isPrerenderedDesign(design)) {
    return getPrerenderedImagePath(design.colors[0], design.placements[0]);
  }
  const images = (design as { images: Record<string, string> }).images;
  const firstVariant = Object.keys(images)[0];
  return `/designs/${design.productId}/${design.id}/${images[firstVariant]}`;
});

const visible = ref(true);

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
    setTimeout(() => emit("dismiss"), 300);
  }, 5000);
});

function handleClick() {
  visible.value = false;
  setTimeout(() => emit("dismiss"), 300);
}
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="upsell-toast" @click="handleClick">
      <img :src="thumbnail" :alt="design.name" class="toast-image" />
      <div class="toast-content">
        <orio-view-text type="subtitle" size="small">
          {{ t("upsell.pairItWith", { name: design.name }) }}
        </orio-view-text>
        <nuxt-link
          :to="`/product/${design.productId}/design/${design.id}`"
          class="toast-link"
          @click.stop
        >
          {{ t("upsell.viewDesign") }}
        </nuxt-link>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.upsell-toast {
  position: fixed;
  bottom: calc(var(--foot-height, 4rem) + 1rem);
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
  border-radius: var(--border-radius-md, 0.5rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  cursor: pointer;
  max-width: 20rem;
}

.toast-image {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: cover;
  border-radius: var(--border-radius-sm, 0.25rem);
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toast-link {
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: underline;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
