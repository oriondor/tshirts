import type { ProductId } from "~/types/products";
import {
  designs,
  defaultImageProps,
  isPrerenderedDesign,
  isCanvasDesign,
  type Design,
  type ImageProps,
} from "~/assets/configs/designs";
import { products } from "~/assets/configs/products";

export function useDesign(productId: ProductId, designId: string) {
  const design = computed(() =>
    designs[productId]?.find(({ id }) => id === designId),
  );

  const product = computed(() => products?.find(({ id }) => id === productId));

  const exists = computed(() => !!design.value);

  const basePath = `/designs/${productId}/${designId}`;

  const prerendered = computed(() =>
    design.value ? isPrerenderedDesign(design.value) : false,
  );

  const canvasMode = computed(() =>
    design.value ? isCanvasDesign(design.value) : false,
  );

  // --- Pre-rendered design helpers ---

  function getPrerenderedImagePath(color: string, placement: string) {
    return `${basePath}/${color}_${placement}.png`;
  }

  const availableColors = computed(() => {
    const d = design.value;
    if (!d || !isPrerenderedDesign(d)) return [];
    return d.colors;
  });

  const availablePlacements = computed(() => {
    const d = design.value;
    if (!d || !isPrerenderedDesign(d)) return [];
    return d.placements;
  });

  const allPrerenderedImages = computed(() => {
    const d = design.value;
    if (!d || !isPrerenderedDesign(d)) return [];
    return d.colors.flatMap((color) =>
      d.placements.map((placement) =>
        getPrerenderedImagePath(color, placement),
      ),
    );
  });

  // --- Overlay design helpers (legacy) ---

  function getImagePath(variant: string) {
    const d = design.value;
    if (!d || isPrerenderedDesign(d)) return "";
    const imageName = d.images[variant] ?? Object.values(d.images)[0];
    return imageName ? `${basePath}/${imageName}` : "";
  }

  function getImageProps(variant: string): Required<ImageProps> {
    const d = design.value;
    if (!d || isPrerenderedDesign(d)) return defaultImageProps;
    const props = d.imageProps?.[variant];
    return { ...defaultImageProps, ...props };
  }

  function getBaseImage(variant: string): string {
    const d = design.value;
    if (!d || isPrerenderedDesign(d)) return "";
    const props = d.imageProps?.[variant];
    if (props?.baseImage) return `/products/${productId}/${props.baseImage}`;
    return `/products/${productId}/base.png`;
  }

  const allImagePaths = computed(() => {
    const d = design.value;
    if (!d) return [];
    if (isPrerenderedDesign(d)) return allPrerenderedImages.value;
    return Object.values(d.images).map((img) => `${basePath}/${img}`);
  });

  const availableVariants = computed(() => {
    const d = design.value;
    if (!d || isPrerenderedDesign(d)) return [];
    return Object.keys(d.images);
  });

  return {
    design,
    product,
    exists,
    prerendered,
    canvasMode,
    // Pre-rendered
    getPrerenderedImagePath,
    availableColors,
    availablePlacements,
    allPrerenderedImages,
    // Overlay
    getImagePath,
    getImageProps,
    allImagePaths,
    availableVariants,
    getBaseImage,
  };
}
