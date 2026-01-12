export function useDesignColor(design: any) {
  const availableColors = computed(() =>
    design ? Object.keys(design.images) : []
  );

  return { availableColors };
}
