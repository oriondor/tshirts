import type { Order } from "~/composables/useCheckout";

interface AdminOrder extends Order {
  userId: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

interface OrdersResponse {
  orders: AdminOrder[];
  paidCount: number;
}

export function useAdmin() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchOrders(): Promise<OrdersResponse> {
    loading.value = true;
    error.value = null;

    try {
      const response = await useApi<OrdersResponse>("/api/admin/orders");
      return response;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to fetch orders";
      error.value = errorMessage;
      return { orders: [], paidCount: 0 };
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrder(orderId: string): Promise<AdminOrder | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await useApi<{ order: AdminOrder }>(
        `/api/admin/orders/${orderId}`
      );
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

  return {
    loading,
    error,
    fetchOrders,
    fetchOrder,
  };
}
