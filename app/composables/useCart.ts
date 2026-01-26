export function useCart() {
  const storage = useCartStorage();

  return {
    items: storage.items,
    isLoaded: storage.isLoaded,
    load: storage.load,
    addItem: storage.addItem,
    removeItem: storage.removeItem,
    updateItem: storage.updateItem,
    clear: storage.clear,
    total: storage.total,
    count: storage.count,
  };
}
