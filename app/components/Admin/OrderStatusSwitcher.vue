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

const { t } = useI18n();

const statusOptions = computed<{ id: OrderStatus; label: string }[]>(() => [
  { id: "unpaid", label: t('status.unpaid') },
  { id: "paid", label: t('status.paid') },
  { id: "processing", label: t('status.processing') },
  { id: "shipped", label: t('status.shipped') },
  { id: "delivered", label: t('status.delivered') },
  { id: "cancelled", label: t('status.cancelled') },
]);

const selectedStatus = ref<{ id: OrderStatus; label: string } | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const { modalProps, openModal } = useModal();

watch(
  () => props.currentStatus,
  (status) => {
    selectedStatus.value =
      statusOptions.value.find((opt) => opt.id === status) ?? null;
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
    return t('admin.notifyProcessing');
  }

  if (from === "processing" && to === "shipped") {
    return t('admin.notifyShipped');
  }

  return null;
});

const confirmationMessage = computed(() => {
  if (!selectedStatus.value) return "";

  const fromLabel =
    statusOptions.value.find((opt) => opt.id === props.currentStatus)?.label ??
    props.currentStatus;
  const toLabel = selectedStatus.value.label;

  if (transitionMessage.value) {
    return t('admin.statusChangeNotify', { from: fromLabel, to: toLabel });
  }

  return t('admin.statusChange', { from: fromLabel, to: toLabel });
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
    <orio-view-text type="title">{{ t('admin.orderStatus') }}</orio-view-text>
    <div class="selector-row">
      <orio-selector
        v-model="selectedStatus"
        :options="statusOptions"
        field="id"
        option-name="label"
        :placeholder="t('admin.selectStatus')"
      />

      <orio-button :disabled="!hasChanges || loading" @click="handleSaveClick">
        {{ t('common.save') }}
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
        :title="t('admin.confirmStatusChange')"
        @update:show="modalProps['onUpdate:show']"
      >
        <orio-view-text>{{ confirmationMessage }}</orio-view-text>

        <template #footer>
          <div class="modal-footer">
            <orio-button variant="secondary" @click="handleCancel">
              {{ t('common.cancel') }}
            </orio-button>
            <orio-button :disabled="loading" @click="confirmStatusChange">
              {{ loading ? t('common.saving') : t('common.confirm') }}
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
