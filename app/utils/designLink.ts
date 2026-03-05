import type { RouteLocationRaw } from "vue-router";
import type { CartItem } from "~/types/cart";
import type { OrderItem } from "~/composables/useCheckout";

/**
 * Builds a route object for a design page, pre-populating URL params.
 * The query object should use the property names from the product config
 * (e.g. "product-color", not "productColor").
 */
export function designLink(
  productId: string,
  designId: string,
  query: Record<string, string | undefined>,
): RouteLocationRaw {
  return {
    path: `/product/${productId}/design/${designId}`,
    query: Object.fromEntries(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== ""),
    ) as Record<string, string>,
  };
}

/**
 * Builds a design page link from a cart item.
 * Cart properties already use URL-compatible names, so strings pass through directly.
 */
export function designLinkFromCartItem(
  productId: string,
  designId: string,
  properties: Record<string, string | File[]>,
): RouteLocationRaw {
  return designLink(
    productId,
    designId,
    Object.fromEntries(
      Object.entries(properties).filter(([, v]) => typeof v === "string"),
    ) as Record<string, string>,
  );
}

/**
 * Builds a design page link from an order item.
 * Remaps the order item's camelCase fields back to the URL param names
 * used by the product config (e.g. productColor → product-color).
 */
export function designLinkFromOrderItem(item: OrderItem): RouteLocationRaw {
  return designLink(item.productId, item.designId, {
    variant: item.variant,
    size: item.size,
    "product-color": item.productColor,
    name: item.name,
    secondary: item.secondaryText,
    request: item.specialRequest,
  });
}
