<script setup lang="ts">
import {
  drawTool,
  textTool,
  eraseTool,
  transformTool,
  imageTool,
  colorPickerTool,
  undoTool,
  redoTool,
  clearTool,
  CanvasToolbar,
  CanvasStage,
} from "orio-ui/canvas";
import type { CanvasConfig } from "~/assets/configs/designs";

const { config, activeSide } = defineProps<{
  config: CanvasConfig;
  activeSide?: string;
}>();

const activeSideIndex = computed(() => {
  const idx = config.sides.findIndex((s) => s.label === activeSide);
  return idx >= 0 ? idx : 0;
});

const nodesPerSide = ref<Record<number, any[]>>(
  Object.fromEntries(config.sides.map((_, i) => [i, []])),
);

const tools = shallowRef([
  drawTool({ color: "#111", size: 4 }),
  textTool({ fontSize: 24, color: "#111" }),
  eraseTool({ radius: 12 }),
  transformTool(),
  imageTool(),
  colorPickerTool({ color: "#111", targets: ["draw", "text"] }),
  undoTool(),
  redoTool(),
  clearTool(),
]);

function makeSetup(sideIndex: number) {
  return async (api: any) => {
    const side = config.sides[sideIndex];
    const img = new Image();
    img.src = side.setupImage;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
    });

    api.addNode({
      type: "image",
      x: 0,
      y: 0,
      width: config.width,
      height: config.height,
      frozen: true,
      zIndex: 0,
      data: {
        src: side.setupImage,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      },
    });
  };
}
</script>

<template>
  <div class="canvas-wrapper">
    <orio-canvas
      v-for="(side, i) in config.sides"
      v-show="activeSideIndex === i"
      :key="i"
      v-model:nodes="nodesPerSide[i]"
      :tools
      :setup="makeSetup(i)"
      :width="config.width"
      :height="config.height"
      background="#f7f8fa"
      class="design-canvas"
    >
      <CanvasToolbar />
      <CanvasStage />
    </orio-canvas>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.design-canvas {
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
}
</style>
