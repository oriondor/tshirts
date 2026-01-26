import type { CartItem, CartItemForOrder } from "~/types/cart";

export interface Order {
  id: string;
  status: string;
  totalPrice: string;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  items?: OrderItem[];
  itemCount?: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productType: string;
  designId: string;
  quantity: number;
  unitPrice: string;
  designColor?: string;
  size?: string;
  productColor?: string;
  name?: string;
  secondaryText?: string;
  specialRequest?: string;
  createdAt: string;
  images?: OrderItemImage[];
}

export interface OrderItemImage {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  sortOrder: number;
}

export const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const statusColors: Record<string, string> = {
  pending: "var(--color-alert)",
  confirmed: "var(--color-info)",
  processing: "var(--color-info)",
  shipped: "var(--color-info-soft)",
  delivered: "var(--color-success)",
  cancelled: "var(--color-danger)",
};

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrice(price: string, currency: string): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(parseFloat(price));
}

export function useCheckout() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  function mapCartItemToOrderItem(item: CartItem): CartItemForOrder {
    const { productType, designId, quantity, price: unitPrice } = item;
    const {
      designColor,
      size,
      productColor,
      name,
      secondaryText,
      specialRequest,
    } = item.properties as Record<string, string>; // We won't unpack images here

    return {
      productType,
      designId,
      quantity,
      unitPrice,
      designColor,
      size,
      productColor,
      name,
      secondaryText,
      specialRequest,
    };
  }

  async function createOrder(
    items: CartItem[],
    notes?: string,
  ): Promise<Order | null> {
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();

      // Add order data as JSON
      const orderData = {
        items: items.map(mapCartItemToOrderItem),
        notes,
      };
      formData.append(
        "data",
        new Blob([JSON.stringify(orderData)], { type: "application/json" }),
      );

      // Add files for each item
      items.forEach((item, itemIndex) => {
        if (item.properties.files && item.properties.files.length > 0) {
          (item.properties.files as File[]).forEach((file) => {
            formData.append(`files[${itemIndex}]`, file);
          });
        }
      });

      const response = await $fetch<{ success: boolean; order: Order }>(
        "/api/orders",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.success) {
        return response.order;
      }

      throw new Error("Failed to create order");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to create order";
      error.value = errorMessage;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrders(): Promise<Order[]> {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ orders: Order[] }>("/api/orders");
      return response.orders;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to fetch orders";
      error.value = errorMessage;
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrder(orderId: string): Promise<Order | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ order: Order }>(`/api/orders/${orderId}`);
      return response.order;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to fetch order";
      error.value = errorMessage;
      return null;
    } finally {
      loading.value = false;
    }
  }

  function getImageUrl(storagePath: string): string {
    return `/api/uploads/${storagePath}`;
  }

  return {
    loading,
    error,
    createOrder,
    fetchOrders,
    fetchOrder,
    getImageUrl,
  };
}
