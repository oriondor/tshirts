import type { ProductId } from "~/types/products";
import { designs } from "~/assets/configs/designs";

export default defineNuxtRouteMiddleware((to) => {
  const productId = to.params.productId as ProductId;
  const productDesigns = designs[productId] || [];

  if (productDesigns.length === 1) {
    return navigateTo(
      `/product/${productId}/design/${productDesigns[0].id}`,
      { replace: true },
    );
  }
});
