import type { ProductId } from "~/types/products";
import {
  designs,
  defaultImageProps,
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

  function getImagePath(color: string) {
    if (!design.value) return "";
    const imageName = design.value.images[color] ?? Object.values(design.value.images)[0];
    return imageName ? `${basePath}/${imageName}` : "";
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

  const availableVariants = computed(() =>
    design.value ? Object.keys(design.value.images) : [],
  );

  return {
    design,
    product,
    exists,
    getImagePath,
    getImageProps,
    allImagePaths,
    availableVariants,
  };
}
