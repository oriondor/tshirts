import type { Address, AddressFormData } from "~/types/address";

export function useAddresses() {
  const addresses = ref<Address[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAddresses(): Promise<Address[]> {
    loading.value = true;
    error.value = null;

    try {
      const response = await useApi<{ addresses: Address[] }>("/api/addresses");
      addresses.value = response.addresses;
      return response.addresses;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to fetch addresses";
      error.value = errorMessage;
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function createAddress(data: AddressFormData): Promise<Address | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await useApi<{ success: boolean; address: Address }>(
        "/api/addresses",
        { method: "POST", body: data as unknown as Record<string, unknown> },
      );

      if (response.success && response.address) {
        // If new address is default, update existing addresses
        if (response.address.isDefault) {
          addresses.value = addresses.value.map((addr) => ({
            ...addr,
            isDefault: false,
          }));
        }
        addresses.value.unshift(response.address);
        return response.address;
      }

      throw new Error("Failed to create address");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to create address";
      error.value = errorMessage;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteAddress(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await useApi<{ success: boolean }>(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      addresses.value = addresses.value.filter((address) => address.id !== id);
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to delete address";
      error.value = errorMessage;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function setDefault(id: string): Promise<boolean> {
    error.value = null;

    try {
      await useApi<{ success: boolean }>(`/api/addresses/set-default/${id}`, {
        method: "PATCH",
      });

      addresses.value = addresses.value.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }));
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to set as default";
      error.value = errorMessage;
      return false;
    }
  }

  function formatAddress(address: Address): string {
    const parts = [
      address.recipientName,
      `${address.street} ${address.streetNumber}`,
      address.additionalInfo,
      `${address.postalCode} ${address.city}`,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  }

  function formatAddressLines(address: Address): string[] {
    const lines = [
      address.recipientName,
      `${address.street} ${address.streetNumber}`,
    ];

    if (address.additionalInfo) {
      lines.push(address.additionalInfo);
    }

    lines.push(`${address.postalCode} ${address.city}`);
    lines.push(address.country);

    return lines;
  }

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    setDefault,
    createAddress,
    deleteAddress,
    formatAddress,
    formatAddressLines,
  };
}
