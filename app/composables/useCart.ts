import { useSessionStorage } from "@vueuse/core";
import type { CartItem } from "~/types/cart";

export function useCart() {
  const items = useSessionStorage<CartItem[]>("cart", []);

  function addItem(item: CartItem) {
    items.value.push(item);
  }

  function removeItem(index: number) {
    items.value.splice(index, 1);
  }

  function clear() {
    items.value = [];
  }

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  return {
    items,
    addItem,
    removeItem,
    clear,
    total,
    count,
  };
}
