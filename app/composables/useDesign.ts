import type { ProductType } from "~/types/products";
import { designs, defaultImageProps, type ImageProps } from "~/assets/configs/designs";

export function useDesign(productType: ProductType, designId: string) {
  const design = computed(() =>
    designs[productType]?.find(({ id }) => id === designId),
  );

  const exists = computed(() => !!design.value);

  const basePath = `/designs/${productType}/${designId}`;

  function getImagePath(color: string) {
    if (!design.value) return "";
    return `${basePath}/${design.value.images[color]}`;
  }

  function getImageProps(color: string): Required<ImageProps> {
    if (!design.value) return defaultImageProps;
    const props = design.value.imageProps?.[color];
    return { ...defaultImageProps, ...props };
  }

  const allImagePaths = computed(() => {
    if (!design.value) return [];
    return Object.values(design.value.images).map(
      (img) => `${basePath}/${img}`,
    );
  });

  const availableColors = computed(() =>
    design.value ? Object.keys(design.value.images) : [],
  );

  return {
    design,
    exists,
    getImagePath,
    getImageProps,
    allImagePaths,
    availableColors,
  };
}
