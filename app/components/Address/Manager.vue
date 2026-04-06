<script setup lang="ts">
import type { Address, AddressFormData } from "~/types/address";
interface Props {
  mode: "profile" | "order";
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Addresses",
});

const { t } = useI18n();
const selectedId = defineModel<string | null>("selectedId");

const {
  addresses,
  loading,
  fetchAddresses,
  createAddress,
  deleteAddress,
  setDefault,
} = useAddresses();

// Modal states
const { modalProps: addModalProps, openModal: openAddModal } = useModal();
const { modalProps: deleteModalProps, openModal: openDeleteModal } = useModal();

const duplicateData = ref<Partial<AddressFormData> | null>(null);
const addressToDeleteId = ref<string | null>(null);

// Fetch addresses on mount
onMounted(() => {
  fetchAddresses();
});

// Handle adding new address
function handleAddClick(event: MouseEvent) {
  duplicateData.value = null;
  openAddModal(event);
}

// Handle duplicating address
function handleDuplicate(address: Address, event: MouseEvent) {
  duplicateData.value = {
    ...address,
    isDefault: false,
  };
  openAddModal(event);
}

// Handle delete confirmation
function handleDeleteClick(addressId: string, event: MouseEvent) {
  addressToDeleteId.value = addressId;
  openDeleteModal(event);
}

// Submit new address
async function handleAddSubmit(data: AddressFormData) {
  // In profile mode, if setting as default, update the data
  // In order mode, we just create the address without default flag affecting selection
  const newAddress = await createAddress(data);
  if (newAddress) {
    addModalProps.value.show = false;
    duplicateData.value = null;

    // In order mode, auto-select the new address
    if (props.mode === "order") {
      selectedId.value = newAddress.id;
    }
  }
}

// Confirm delete
async function handleDeleteConfirm() {
  if (!addressToDeleteId.value) return;

  const deletedId = addressToDeleteId.value;
  const success = await deleteAddress(deletedId);

  if (success) {
    deleteModalProps.value.show = false;
    addressToDeleteId.value = null;

    // Reset selection if deleted address was selected
    if (selectedId.value === deletedId) {
      selectedId.value = null;
    }
  }
}

// Handle selecting an address
function handleSelect(address: Address) {
  selectedId.value = address.id;
}

// Computed: whether we're in selectable mode
const isSelectable = computed(() => props.mode === "order");
</script>

<template>
  <div class="address-manager">
    <div class="header">
      <h2>{{ title }}</h2>
      <orio-button variant="subdued" iocn="plus" @click="handleAddClick">
        {{ t('common.add') }}
      </orio-button>
    </div>

    <orio-icon v-if="loading" name="loading" />

    <template v-else>
      <orio-empty-state
        v-if="addresses.length === 0"
        :title="t('address.noSaved')"
        size="small"
      >
        <template #action>
          <orio-button @click="handleAddClick">{{ t('address.addAddress') }}</orio-button>
        </template>
      </orio-empty-state>

      <template v-else>
        <div class="addresses-list">
          <address-card
            v-for="address in addresses"
            :key="address.id"
            :address="address"
            :selected="selectedId === address.id"
            :selectable="isSelectable"
            @select="handleSelect(address)"
            @duplicate="handleDuplicate(address, $event)"
            @delete="handleDeleteClick(address.id, $event)"
            @set-default="setDefault(address.id)"
          />
        </div>
      </template>
    </template>

    <!-- Add/Duplicate Modal -->
    <ClientOnly>
      <address-add-modal
        :modal-props="addModalProps"
        :initial-data="duplicateData || undefined"
        :is-duplicate="!!duplicateData"
        @submit="handleAddSubmit"
      />
    </ClientOnly>

    <!-- Delete Confirmation Modal -->
    <ClientOnly>
      <address-delete-modal
        :modal-props="deleteModalProps"
        @confirm="handleDeleteConfirm"
      />
    </ClientOnly>
  </div>
</template>

<style scoped>
.address-manager {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.addresses-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.add-button-container {
  margin-top: 1rem;
}
</style>
