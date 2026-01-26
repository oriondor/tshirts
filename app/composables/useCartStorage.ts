import type { CartItem } from "~/types/cart";

const DB_NAME = "cart-storage";
const DB_VERSION = 1;
const STORE_NAME = "cart-items";

interface StoredCartItem {
  id: string;
  designId: string;
  productType: string;
  quantity: number;
  price: number;
  properties: Record<string, string | File[]>;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

async function getAllItems(): Promise<StoredCartItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

async function saveItem(item: StoredCartItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function deleteItem(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function clearAll(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Singleton state - persists across all calls to useCartStorage()
const items = ref<CartItem[]>([]);
const isLoaded = ref(false);
const isLoading = ref(false);

async function load() {
  if (import.meta.server) return;
  if (isLoaded.value || isLoading.value) return;

  isLoading.value = true;
  try {
    items.value = await getAllItems();
  } catch (e) {
    console.error("Failed to load cart from IndexedDB:", e);
    items.value = [];
  }
  isLoaded.value = true;
  isLoading.value = false;
}

function deepToRaw<T>(obj: T): T {
  const raw = toRaw(obj);
  if (raw === null || typeof raw !== "object") {
    return raw;
  }
  if (raw instanceof File || raw instanceof Blob) {
    return raw;
  }
  if (Array.isArray(raw)) {
    return raw.map(deepToRaw) as T;
  }
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(raw)) {
    result[key] = deepToRaw((raw as Record<string, unknown>)[key]);
  }
  return result as T;
}

async function addItem(item: CartItem) {
  items.value.push(item);
  const rawItem = deepToRaw(item);
  await saveItem(rawItem);
}

async function removeItem(index: number) {
  const item = items.value[index];
  if (item) {
    items.value.splice(index, 1);
    await deleteItem(item.id);
  }
}

async function updateItem(index: number, item: CartItem) {
  items.value[index] = item;
  await saveItem(item);
}

async function clear() {
  items.value = [];
  await clearAll();
}

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

const count = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity, 0),
);

export function useCartStorage() {
  // Auto-load on first client-side use
  if (import.meta.client && !isLoaded.value && !isLoading.value) {
    load();
  }

  return {
    items,
    isLoaded,
    load,
    addItem,
    removeItem,
    updateItem,
    clear,
    total,
    count,
  };
}
