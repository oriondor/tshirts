<script setup lang="ts">
import type { OrderStatus } from "~~/server/db/schema/orders";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updated: [status: OrderStatus];
}>();

const statusOptions: { id: OrderStatus; label: string }[] = [
  { id: "unpaid", label: "Unpaid" },
  { id: "paid", label: "Paid" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const selectedStatus = ref<{ id: OrderStatus; label: string } | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const { modalProps, openModal } = useModal();

watch(
  () => props.currentStatus,
  (status) => {
    selectedStatus.value =
      statusOptions.find((opt) => opt.id === status) ?? null;
  },
  { immediate: true },
);

const hasChanges = computed(
  () => selectedStatus.value?.id !== props.currentStatus,
);

const transitionMessage = computed(() => {
  if (!hasChanges.value || !selectedStatus.value) return null;

  const from = props.currentStatus;
  const to = selectedStatus.value.id;

  if (from === "paid" && to === "processing") {
    return "User will receive notification about order started to be processing";
  }

  if (from === "processing" && to === "shipped") {
    return "User will receive notification that order is shipped";
  }

  return null;
});

const confirmationMessage = computed(() => {
  if (!selectedStatus.value) return "";

  const fromLabel =
    statusOptions.find((opt) => opt.id === props.currentStatus)?.label ??
    props.currentStatus;
  const toLabel = selectedStatus.value.label;

  if (transitionMessage.value) {
    return `Are you sure you want to switch status from ${fromLabel} to ${toLabel} and notify user about changes?`;
  }

  return `Are you sure you want to switch status from ${fromLabel} to ${toLabel}?`;
});

function handleSaveClick(event: MouseEvent) {
  if (!hasChanges.value) return;
  openModal(event);
}

async function confirmStatusChange() {
  if (!selectedStatus.value || !hasChanges.value) return;

  loading.value = true;
  error.value = null;

  try {
    await useApi(`/api/admin/orders/${props.orderId}`, {
      method: "PATCH",
      body: { status: selectedStatus.value.id },
    });

    emit("updated", selectedStatus.value.id);
    modalProps.value["onUpdate:show"](false);
  } catch (e: any) {
    error.value =
      e?.data?.message || e?.message || "Failed to update order status";
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  modalProps.value["onUpdate:show"](false);
}
</script>

<template>
  <orio-banner>
    <orio-view-text type="title">Order status</orio-view-text>
    <div class="selector-row">
      <orio-selector
        v-model="selectedStatus"
        :options="statusOptions"
        field="id"
        option-name="label"
        placeholder="Select status"
      />

      <orio-button :disabled="!hasChanges || loading" @click="handleSaveClick">
        Save
      </orio-button>
    </div>

    <orio-view-text v-if="transitionMessage" type="italics">
      {{ transitionMessage }}
    </orio-view-text>

    <orio-view-text v-if="error" type="text" style="color: var(--color-danger)">
      {{ error }}
    </orio-view-text>

    <ClientOnly>
      <orio-modal
        :show="modalProps.show"
        :origin="modalProps.origin"
        title="Confirm Status Change"
        @update:show="modalProps['onUpdate:show']"
      >
        <orio-view-text>{{ confirmationMessage }}</orio-view-text>

        <template #footer>
          <div class="modal-footer">
            <orio-button variant="secondary" @click="handleCancel">
              Cancel
            </orio-button>
            <orio-button :disabled="loading" @click="confirmStatusChange">
              {{ loading ? "Saving..." : "Confirm" }}
            </orio-button>
          </div>
        </template>
      </orio-modal>
    </ClientOnly>
  </orio-banner>
</template>

<style scoped>
.selector-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}
</style>
