<script setup lang="ts">
import type { ProductId } from "~/types/products";
import { designs as designsConfig } from "~/assets/configs/designs";
import {
  expandDesignVariants,
  defaultChaosConfig,
  type ScatterVariant,
  type ScatterChaosConfig,
} from "./variants";

const { productId } = defineProps<{ productId: ProductId }>();

// chaos: 0 = neat grid, 1 = full mess
const CHAOS = 1;
// offset: how far items can wander from their grid cell (fraction of cell size)
const OFFSET = 0.6;
const ITEM_SIZE = 230;
const PADDING = 2;

// chaos scales how often duplicates (flips, color variants) appear
const variantsConfig: ScatterChaosConfig = {
  ...defaultChaosConfig,
  flipChance: defaultChaosConfig.flipChance * CHAOS,
  colorVariantChance: defaultChaosConfig.colorVariantChance * CHAOS,
  maxColorVariants: Math.round(defaultChaosConfig.maxColorVariants * CHAOS),
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const allDesigns = computed(() =>
  (designsConfig[productId] ?? []).filter((d) => !d.canvas),
);

interface ScatteredItem extends ScatterVariant {
  x: number;
  y: number;
  rotation: number;
  size: number;
}

const expandedVariants = computed<ScatterVariant[]>(() =>
  allDesigns.value.flatMap((design, i) =>
    expandDesignVariants(design, seededRandom(i * 104729 + 17), variantsConfig),
  ),
);

const scattered = computed<ScatteredItem[]>(() => {
  const items = expandedVariants.value;
  const count = items.length;
  if (!count) return [];

  const cols = Math.ceil(Math.sqrt(count * 1.4));
  const gap = ITEM_SIZE * 0.15;
  const cellW = ITEM_SIZE + gap;
  const cellH = ITEM_SIZE + gap;

  return items.map((variant, i) => {
    const rand = seededRandom(i * 7919 + 31);
    const col = i % cols;
    const row = Math.floor(i / cols);

    // later items get thrown harder
    const t = count > 1 ? i / (count - 1) : 0;
    const spread = 0.3 + t * 0.4;

    const offsetX = (rand() - 0.5) * cellW * OFFSET * spread * CHAOS;
    const offsetY = (rand() - 0.5) * cellH * OFFSET * spread * CHAOS;
    const rotation = (rand() - 0.5) * 720 * spread * CHAOS;
    const sizeVariation = ITEM_SIZE * (0.75 + rand() * 0.5) * (0.85 + t * 0.3);
    return {
      ...variant,
      x: col * cellW + cellW / 2 - ITEM_SIZE / 2 + offsetX,
      y: row * cellH + cellH / 2 - ITEM_SIZE / 2 + offsetY,
      rotation,
      size: sizeVariation,
    };
  });
});

const worldWidth = computed(() => {
  if (!scattered.value.length) return 0;
  return Math.max(...scattered.value.map((s) => s.x + s.size)) + PADDING;
});

const worldHeight = computed(() => {
  if (!scattered.value.length) return 0;
  return Math.max(...scattered.value.map((s) => s.y + s.size)) + PADDING * 3;
});

const hint = useTemplateRef<{ dismiss: () => void }>("hint");

function onInteract() {
  hint.value?.dismiss();
}
</script>

<template>
  <orio-zoomable-container
    class="scatter-viewport"
    :initial-scale="0.85"
    :min-scale="0.3"
    :max-scale="3"
    @wheel.once="onInteract"
    @pointerdown.once="onInteract"
  >
    <div
      class="scatter-world"
      :style="{ width: `${worldWidth}px`, height: `${worldHeight}px` }"
    >
      <designs-scatter-texture />
      <designs-scatter-item
        v-for="item in scattered"
        :key="item.key"
        v-bind="item"
      />
    </div>
  </orio-zoomable-container>
  <designs-scatter-hint ref="hint" />
</template>

<style scoped>
.scatter-viewport {
  width: 100%;
  height: 100%;
}

.scatter-world {
  position: relative;
}
</style>
