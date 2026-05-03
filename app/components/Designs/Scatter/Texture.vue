<script setup lang="ts">
interface Props {
  base?: string;
  grain?: string;
  scale?: number;
  woody?: 1 | 2 | 3 | 4 | 5;
  grainLines?: 1 | 2 | 3 | 4 | 5;
  seed?: number;
}

const {
  base = "#e8d5b7",
  grain = "#d4c0a0",
  scale = 200,
  woody = 3,
  grainLines = 3,
  seed = 42,
} = defineProps<Props>();

const woodyParams = computed(() => {
  const factor = (woody - 1) / 4;
  return {
    frequency: 0.05 + factor * 0.2,
    amplitude: 0.1 + factor * 0.4,
    secondaryFrequency: 0.15 + factor * 0.5,
    secondaryAmplitude: 0.05 + factor * 0.2,
  };
});

const grainParams = computed(() => {
  const factor = (grainLines - 1) / 4;
  return {
    density: 0.2 + factor * 0.6,
    frequency: 0.3 + factor * 1.0,
    warp: 2 + factor * 12,
    noise: 0.04 + factor * 0.16,
  };
});

const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
const tile = ref("");

function seededRandom(s: number) {
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hexToRgb(hex: string) {
  const parsed = parseInt(hex.replace("#", ""), 16);
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

function render() {
  const canvasEl = canvas.value;
  if (!canvasEl) return;
  canvasEl.width = scale;
  canvasEl.height = scale;
  const context = canvasEl.getContext("2d")!;
  const imageData = context.createImageData(scale, scale);
  const pixels = imageData.data;

  const baseRgb = hexToRgb(base);
  const grainRgb = hexToRgb(grain);
  const random = seededRandom(seed);

  const woodyConfig = woodyParams.value;
  const grainConfig = grainParams.value;

  for (let y = 0; y < scale; y++) {
    const wave =
      Math.sin(y * woodyConfig.frequency) * woodyConfig.amplitude +
      Math.sin(y * woodyConfig.secondaryFrequency) * woodyConfig.secondaryAmplitude;
    for (let x = 0; x < scale; x++) {
      const offset = (y * scale + x) * 4;
      const noise = random() * grainConfig.noise;
      const grainLine =
        Math.sin((y + Math.sin(x * 0.02) * grainConfig.warp) * grainConfig.frequency) * 0.5 + 0.5;
      const mix = grainLine * grainConfig.density + wave + noise;
      const blend = Math.max(0, Math.min(1, mix));

      pixels[offset] = baseRgb[0] + (grainRgb[0] - baseRgb[0]) * blend;
      pixels[offset + 1] = baseRgb[1] + (grainRgb[1] - baseRgb[1]) * blend;
      pixels[offset + 2] = baseRgb[2] + (grainRgb[2] - baseRgb[2]) * blend;
      pixels[offset + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);
  tile.value = canvasEl.toDataURL();
}

onMounted(render);
watch(() => [base, grain, scale, woody, grainLines, seed], render);
</script>

<template>
  <canvas ref="canvas" class="offscreen" />
  <div
    v-if="tile"
    class="texture"
    :style="{ backgroundImage: `url(${tile})`, backgroundSize: `${scale}px` }"
  />
</template>

<style scoped>
.offscreen {
  display: none;
}

.texture {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  pointer-events: none;
  opacity: 0.15;
}
</style>
