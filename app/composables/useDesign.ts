import type { ProductType } from "~/types/products";
import { designs } from "~/assets/configs/designs";

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
    allImagePaths,
    availableColors,
  };
}
