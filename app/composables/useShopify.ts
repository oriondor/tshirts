interface ShopifyVariant {
  id: string;
  gid: string;
  title: string;
  price: string;
}

interface ShopifyProduct {
  id: string;
  gid: string;
  title: string;
  variants: ShopifyVariant[];
}

export function useShopify() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getProducts(): Promise<ShopifyProduct[]> {
    loading.value = true;
    error.value = null;

    try {
      const response = await useApi<{ products: ShopifyProduct[] }>(
        "/api/shopify/products"
      );
      return response.products;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to fetch products";
      error.value = errorMessage;
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    getProducts,
  };
}
