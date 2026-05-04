<script setup lang="ts">
import type { ProductId } from "~/types/products";
import {
  isPrerenderedDesign,
  defaultImageProps,
  type Design,
  type PrerenderedDesign,
} from "~/assets/configs/designs";

const { design, x, y, rotation, size } = defineProps<{
  design: Design;
  x: number;
  y: number;
  rotation: number;
  size: number;
}>();

const { formatDecimal } = useDecimalFormatter();

const activeItem = useState<string | null>("scatter-active", () => null);
const mouseHover = ref(false);
const lifted = computed(
  () => mouseHover.value || activeItem.value === design.id,
);

function onClick(e: Event) {
  if (!("ontouchstart" in window)) return;
  if (activeItem.value === design.id) return;
  e.preventDefault();
  activeItem.value = design.id;
}

function onTouchOutside(e: TouchEvent) {
  if ((e.target as HTMLElement)?.closest(".scatter-item")) return;
  activeItem.value = null;
}

onMounted(() => document.addEventListener("touchstart", onTouchOutside));
onUnmounted(() => document.removeEventListener("touchstart", onTouchOutside));

const { getPrerenderedImagePath, getImagePath, getBaseImage, getImageProps } =
  useDesign(design.productId as ProductId, design.id);

const prerendered = isPrerenderedDesign(design);

const image = computed(() => {
  if (prerendered) {
    const d = design as PrerenderedDesign;
    return getPrerenderedImagePath(
      d.colors[0],
      d.defaultPlacement ?? d.placements[0],
    );
  }
  const variant = Object.keys(
    (design as { images: Record<string, string> }).images,
  )[0];
  return variant ? getImagePath(variant) : "";
});

// const overlayProps = computed(() => {
//   if (prerendered) return null;
//   const variant = Object.keys(
//     (design as { images: Record<string, string> }).images,
//   )[0];
//   if (!variant) return null;
//   return {
//     base: getBaseImage(variant),
//     overlay: image.value,
//     params: { ...defaultImageProps, ...getImageProps(variant) },
//   };
// });

const restRotation = Math.round(rotation / 360) * 360;

const link = `/product/${design.productId}/design/${design.id}`;
</script>

<template>
  <nuxt-link
    :to="link"
    class="scatter-item"
    :class="{ lifted }"
    @mouseenter="mouseHover = true"
    @mouseleave="mouseHover = false"
    @click.capture="onClick"
  >
    <img v-if="prerendered" :src="image" :alt="design.name" draggable="false" />
    <span class="label">
      {{ design.name }}
      <client-only>
        <span class="price">€{{ formatDecimal(design.price) }}</span>
      </client-only>
    </span>
  </nuxt-link>
</template>

<style scoped>
.scatter-item {
  position: absolute;
  left: v-bind("`${x}px`");
  top: v-bind("`${y}px`");
  width: v-bind("`${size}px`");
  transform: rotate(v-bind("`${rotation}deg`"));
  transform-origin: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    filter 0.45s ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12));
}

.scatter-item.lifted {
  transform: rotate(v-bind("`${restRotation}deg`")) scale(1.4) translateY(-12px);
  filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.2));
  z-index: 10;
}

.scatter-item img {
  width: 100%;
  display: block;
  pointer-events: none;
}

.label {
  position: absolute;
  bottom: -0.4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  white-space: nowrap;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0;
  text-shadow:
    0 0 8px var(--color-bg, #fff),
    0 0 16px var(--color-bg, #fff),
    0 0 30px var(--color-bg, #fff);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.price {
  font-weight: 400;
  font-size: 0.75rem;
  opacity: 0.6;
}

.scatter-item.lifted .label {
  opacity: 1;
}
</style>
