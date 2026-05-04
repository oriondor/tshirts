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

const { svgPath, color, canvasConfig, activeSide } = defineProps<{
  svgPath: string;
  color: string;
  canvasConfig: CanvasConfig;
  activeSide?: string;
}>();

const maxWidth = "380px";

const VIEW_BOX_W = 2048;
const VIEW_BOX_H = 1881;

const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;

const containerRef = useTemplateRef("container");
const svgContainerRef = useTemplateRef("svgContainer");
const svgContent = ref("");

// Compute canvas pixel size from the SVG container's rendered width
const canvasPixelWidth = ref(1);
const canvasPixelHeight = ref(1);

function updateCanvasSize() {
  const el = svgContainerRef.value;
  if (!el) return;
  const containerWidth = el.clientWidth;
  if (!containerWidth) return;
  const scale = containerWidth / VIEW_BOX_W;
  canvasPixelWidth.value = Math.round(canvasConfig.area.w * scale);
  canvasPixelHeight.value = Math.round(canvasConfig.area.h * scale);
}

const resizeObserver = ref<ResizeObserver>();
onMounted(() => {
  nextTick(updateCanvasSize);
  resizeObserver.value = new ResizeObserver(updateCanvasSize);
  const el = svgContainerRef.value;
  if (el) resizeObserver.value.observe(el);
});
onUnmounted(() => resizeObserver.value?.disconnect());

const { data } = await useFetch<string>(() => svgPath, {
  responseType: "text",
});
watchEffect(() => {
  if (data.value) svgContent.value = data.value;
});

const colorTargets = ["main", "vorot2"];

function applyColor() {
  const el = containerRef.value;
  if (!el) return;
  for (const label of colorTargets) {
    const target = el.querySelector(`[inkscape\\:label="${label}"]`);
    if (target) (target as SVGElement).setAttribute("fill", color);
  }
}

watch(() => color, applyColor);
watch(svgContent, () => {
  nextTick(applyColor);
  nextTick(updateCanvasSize);
});
onMounted(() => nextTick(applyColor));

// --- Canvas ---

const activeSideIndex = computed(() => {
  const idx = canvasConfig.sides.findIndex((s) => s.label === activeSide);
  return idx >= 0 ? idx : 0;
});

const canvasName = computed(() => `tshirt-${activeSideIndex.value}`);

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
</script>

<template>
  <div class="schematic-wrapper">
    <div ref="svgContainer" class="svg-canvas-container">
      <div ref="container" class="tshirt-schematic" v-html="svgContent" />
      <div class="canvas-overlay">
        <orio-canvas
          v-for="(side, i) in canvasConfig.sides"
          v-show="activeSideIndex === i"
          :key="i"
          :name="`tshirt-${i}`"
          :tools
          :width="canvasPixelWidth"
          :height="canvasPixelHeight"
          background="transparent"
        >
          <CanvasStage />
        </orio-canvas>
      </div>
    </div>
    <CanvasToolbar :canvas="canvasName" />
  </div>
</template>

<style scoped>
.schematic-wrapper {
  width: 100%;
  max-width: v-bind(maxWidth);
  display: flex;
  flex-direction: column-reverse;
}

.svg-canvas-container {
  position: relative;
}

.tshirt-schematic :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

.canvas-overlay {
  position: absolute;
  top: v-bind("toPercent(canvasConfig.area.y, VIEW_BOX_H)");
  left: v-bind("toPercent(canvasConfig.area.x, VIEW_BOX_W)");
  width: v-bind("toPercent(canvasConfig.area.w, VIEW_BOX_W)");
  height: v-bind("toPercent(canvasConfig.area.h, VIEW_BOX_H)");
  overflow: hidden;
  border: 1px dashed rgb(186, 184, 185);
  border-radius: var(--border-radius-md);
}

:deep(.canvas-root) {
  width: 100%;
}

:deep(.canvas-toolbar) {
  flex-wrap: wrap;
  place-content: center;
}
</style>
